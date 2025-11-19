"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TestTenantManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTenantManager = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let TestTenantManager = TestTenantManager_1 = class TestTenantManager {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TestTenantManager_1.name);
        this.TEST_CENTERS_PREFIX = 'test_';
    }
    async createTestCenter(config) {
        const centerId = `${this.TEST_CENTERS_PREFIX}${Date.now()}`;
        const centerConfig = {
            id: centerId,
            name: config.name || `Test Center ${centerId}`,
            code: config.code || `TC${centerId}`,
            province: config.province || 'DKI Jakarta',
            isActive: true,
            ...config,
        };
        try {
            const center = await this.prisma.client.$queryRaw `
        INSERT INTO system.centers (id, name, code, province, is_active, created_at, updated_at)
        VALUES (${centerId}, ${centerConfig.name}, ${centerConfig.code}, ${centerConfig.province}, ${true}, NOW(), NOW())
        RETURNING id, name, code, province, is_active
      `;
            await this.prisma.client.$executeRaw `
        CREATE SCHEMA IF NOT EXISTS ${this.TEST_CENTERS_PREFIX}${centerId}
      `;
            await this.prisma.client.$executeRaw `
        GRANT USAGE ON SCHEMA ${this.TEST_CENTERS_PREFIX}${centerId} TO inamsos
      `;
            await this.prisma.client.$executeRaw `
        GRANT CREATE ON SCHEMA ${this.TEST_CENTERS_PREFIX}${centerId} TO inamsos
      `;
            this.logger.log(`Test center created: ${centerId}`);
            return centerConfig;
        }
        catch (error) {
            this.logger.error(`Failed to create test center: ${error.message}`);
            throw error;
        }
    }
    async cleanupTestCenter(centerId) {
        try {
            const schemaName = `${this.TEST_CENTERS_PREFIX}${centerId}`;
            await this.prisma.client.$executeRaw `
        DROP SCHEMA IF EXISTS ${schemaName} CASCADE
      `;
            await this.prisma.client.$queryRaw `
        DELETE FROM system.centers WHERE id = ${centerId}
      `;
            this.logger.log(`Test center cleaned up: ${centerId}`);
        }
        catch (error) {
            this.logger.error(`Failed to cleanup test center ${centerId}: ${error.message}`);
            throw error;
        }
    }
    async validateDataIsolation(centerIds) {
        const violations = [];
        let isIsolated = true;
        try {
            for (const centerId of centerIds) {
                const schemaName = `${this.TEST_CENTERS_PREFIX}${centerId}`;
                const schemaExists = await this.prisma.client.$queryRaw `
          SELECT 1 FROM information_schema.schemata
          WHERE schema_name = ${schemaName}
        `;
                if (!schemaExists || schemaExists.length === 0) {
                    violations.push(`Schema not found for center: ${centerId}`);
                    isIsolated = false;
                    continue;
                }
                const crossSchemaAccess = await this.prisma.client.$queryRaw `
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
        }
        catch (error) {
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
    async createTestData(centerId) {
        const schemaName = `${this.TEST_CENTERS_PREFIX}${centerId}`;
        try {
            await this.prisma.client.$executeRaw `
        CREATE TABLE IF NOT EXISTS ${schemaName}.test_patients (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
            await this.prisma.client.$queryRaw `
        INSERT INTO ${schemaName}.test_patients (name)
        VALUES ('Test Patient 1'), ('Test Patient 2')
      `;
            this.logger.log(`Test data created for center: ${centerId}`);
        }
        catch (error) {
            this.logger.error(`Failed to create test data for ${centerId}: ${error.message}`);
            throw error;
        }
    }
    async getTestCenters() {
        try {
            const centers = await this.prisma.client.$queryRaw `
        SELECT id, name, code, province, is_active
        FROM system.centers
        WHERE id LIKE '${this.TEST_CENTERS_PREFIX}%'
        ORDER BY created_at DESC
      `;
            return centers;
        }
        catch (error) {
            this.logger.error(`Failed to get test centers: ${error.message}`);
            return [];
        }
    }
    async cleanupAllTestCenters() {
        const testCenters = await this.getTestCenters();
        for (const center of testCenters) {
            await this.cleanupTestCenter(center.id);
        }
        this.logger.log(`Cleaned up ${testCenters.length} test centers`);
    }
};
exports.TestTenantManager = TestTenantManager;
exports.TestTenantManager = TestTenantManager = TestTenantManager_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestTenantManager);
//# sourceMappingURL=test-tenant-manager.service.js.map