import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface TestCenterConfig {
  id: string;
  name: string;
  code: string;
  province: string;
  isActive: boolean;
}

export interface IsolationResult {
  isIsolated: boolean;
  violations: string[];
  details: any;
}

@Injectable()
export class TestTenantManager {
  private readonly logger = new Logger(TestTenantManager.name);
  private readonly TEST_CENTERS_PREFIX = 'test_';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a test center with isolated schema
   */
  async createTestCenter(config: Partial<TestCenterConfig>): Promise<TestCenterConfig> {
    const centerId = `${this.TEST_CENTERS_PREFIX}${Date.now()}`;

    const centerConfig: TestCenterConfig = {
      id: centerId,
      name: config.name || `Test Center ${centerId}`,
      code: config.code || `TC${centerId}`,
      province: config.province || 'DKI Jakarta',
      isActive: true,
      ...config,
    };

    try {
      // Create center in system schema
      const center = await this.prisma.$queryRaw`
        INSERT INTO system.centers (id, name, code, province, is_active, created_at, updated_at)
        VALUES (${centerId}, ${centerConfig.name}, ${centerConfig.code}, ${centerConfig.province}, ${true}, NOW(), NOW())
        RETURNING id, name, code, province, is_active
      `;

      // Create isolated schema for test center
      await this.prisma.$executeRaw`
        CREATE SCHEMA IF NOT EXISTS ${this.TEST_CENTERS_PREFIX}${centerId}
      `;

      // Grant permissions
      await this.prisma.$executeRaw`
        GRANT USAGE ON SCHEMA ${this.TEST_CENTERS_PREFIX}${centerId} TO inamsos
      `;

      await this.prisma.$executeRaw`
        GRANT CREATE ON SCHEMA ${this.TEST_CENTERS_PREFIX}${centerId} TO inamsos
      `;

      this.logger.log(`Test center created: ${centerId}`);
      return centerConfig;

    } catch (error) {
      this.logger.error(`Failed to create test center: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cleanup test center and remove schema
   */
  async cleanupTestCenter(centerId: string): Promise<void> {
    try {
      const schemaName = `${this.TEST_CENTERS_PREFIX}${centerId}`;

      // Drop schema with CASCADE
      await this.prisma.$executeRaw`
        DROP SCHEMA IF EXISTS ${schemaName} CASCADE
      `;

      // Remove center from system schema
      await this.prisma.$queryRaw`
        DELETE FROM system.centers WHERE id = ${centerId}
      `;

      this.logger.log(`Test center cleaned up: ${centerId}`);

    } catch (error) {
      this.logger.error(`Failed to cleanup test center ${centerId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate data isolation between test centers
   */
  async validateDataIsolation(centerIds: string[]): Promise<IsolationResult> {
    const violations: string[] = [];
    let isIsolated = true;

    try {
      for (const centerId of centerIds) {
        const schemaName = `${this.TEST_CENTERS_PREFIX}${centerId}`;

        // Check if schema exists and is isolated
        const schemaExists = await this.prisma.$queryRaw<any[]>`
          SELECT 1 FROM information_schema.schemata
          WHERE schema_name = ${schemaName}
        `;

        if (!schemaExists || schemaExists.length === 0) {
          violations.push(`Schema not found for center: ${centerId}`);
          isIsolated = false;
          continue;
        }

        // Verify no cross-schema access
        const crossSchemaAccess = await this.prisma.$queryRaw<any[]>`
          SELECT COUNT(*) as count
          FROM information_schema.role_table_grants
          WHERE table_schema LIKE 'test_%'
          AND grantee != 'inamsos'
        `;

        if (crossSchemaAccess[0]?.count > 0) {
          violations.push(`Cross-schema access detected for center: ${centerId}`);
          isIsolated = false;
        }
      }

    } catch (error) {
      violations.push(`Error validating isolation: ${error.message}`);
      isIsolated = false;
    }

    return {
      isIsolated,
      violations,
      details: {
        centersChecked: centerIds.length,
        violationsCount: violations.length,
      },
    };
  }

  /**
   * Create test data for a center
   */
  async createTestData(centerId: string): Promise<void> {
    const schemaName = `${this.TEST_CENTERS_PREFIX}${centerId}`;

    try {
      // Create test tables in center schema
      await this.prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS ${schemaName}.test_patients (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;

      // Insert test data
      await this.prisma.$queryRaw`
        INSERT INTO ${schemaName}.test_patients (name)
        VALUES ('Test Patient 1'), ('Test Patient 2')
      `;

      this.logger.log(`Test data created for center: ${centerId}`);

    } catch (error) {
      this.logger.error(`Failed to create test data for ${centerId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all test centers
   */
  async getTestCenters(): Promise<TestCenterConfig[]> {
    try {
      const centers = await this.prisma.$queryRaw`
        SELECT id, name, code, province, is_active
        FROM system.centers
        WHERE id LIKE '${this.TEST_CENTERS_PREFIX}%'
        ORDER BY created_at DESC
      `;

      return centers as TestCenterConfig[];

    } catch (error) {
      this.logger.error(`Failed to get test centers: ${error.message}`);
      return [];
    }
  }

  /**
   * Cleanup all test centers
   */
  async cleanupAllTestCenters(): Promise<void> {
    const testCenters = await this.getTestCenters();

    for (const center of testCenters) {
      await this.cleanupTestCenter(center.id);
    }

    this.logger.log(`Cleaned up ${testCenters.length} test centers`);
  }
}