import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class DataProvenanceService {
  constructor(private prisma: PrismaService) {}

  async trackDataChange(
    entityType: string,
    entityId: string,
    fieldName: string,
    oldValue: any,
    newValue: any,
    userId: string,
    reason?: string,
    source?: string,
  ) {
    // Create provenance record
    const provenance = await this.prisma.dataProvenance.create({
      data: {
        entityType,
        entityId,
        fieldName,
        oldValue: JSON.stringify(oldValue),
        newValue: JSON.stringify(newValue),
        userId,
        changeReason: reason,
        dataSource: source || 'MANUAL_ENTRY',
        timestamp: new Date(),
        hash: this.generateProvenanceHash(entityType, entityId, fieldName, newValue),
      },
    });

    return provenance;
  }

  async getDataHistory(entityType: string, entityId: string, fieldName?: string) {
    const where: any = {
      entityType,
      entityId,
    };

    if (fieldName) {
      where.fieldName = fieldName;
    }

    return this.prisma.dataProvenance.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getDataTimeline(entityType: string, entityId: string) {
    const history = await this.getDataHistory(entityType, entityId);

    // Group by field
    const timeline: any = {};

    for (const record of history) {
      if (!timeline[record.fieldName]) {
        timeline[record.fieldName] = [];
      }

      timeline[record.fieldName].push({
        timestamp: record.timestamp,
        oldValue: JSON.parse(record.oldValue),
        newValue: JSON.parse(record.newValue),
        user: record.user,
        reason: record.changeReason,
        source: record.dataSource,
      });
    }

    return timeline;
  }

  async rollbackToVersion(provenanceId: string, userId: string) {
    const provenance = await this.prisma.dataProvenance.findUnique({
      where: { id: provenanceId },
    });

    if (!provenance) {
      throw new Error('Provenance record not found');
    }

    // Create new provenance record for rollback
    await this.trackDataChange(
      provenance.entityType,
      provenance.entityId,
      provenance.fieldName,
      provenance.newValue,
      provenance.oldValue,
      userId,
      `Rollback to version from ${provenance.timestamp}`,
      'ROLLBACK',
    );

    return {
      message: 'Rollback successful',
      restoredValue: JSON.parse(provenance.oldValue),
    };
  }

  async verifyDataIntegrity(entityType: string, entityId: string) {
    const history = await this.getDataHistory(entityType, entityId);

    const integrityIssues: any[] = [];

    for (const record of history) {
      // Verify hash
      const expectedHash = this.generateProvenanceHash(
        record.entityType,
        record.entityId,
        record.fieldName,
        JSON.parse(record.newValue),
      );

      if (record.hash !== expectedHash) {
        integrityIssues.push({
          provenanceId: record.id,
          fieldName: record.fieldName,
          issue: 'HASH_MISMATCH',
          message: 'Data integrity compromised - hash mismatch detected',
        });
      }
    }

    return {
      verified: integrityIssues.length === 0,
      recordsChecked: history.length,
      issues: integrityIssues,
    };
  }

  async getDataLineage(entityType: string, entityId: string) {
    const history = await this.getDataHistory(entityType, entityId);

    // Build lineage tree
    const lineage: any = {
      entity: {
        type: entityType,
        id: entityId,
      },
      createdAt: history[history.length - 1]?.timestamp || null,
      createdBy: history[history.length - 1]?.user || null,
      modifications: history.length,
      contributors: [...new Set(history.map((h) => h.userId))].length,
      sources: [...new Set(history.map((h) => h.dataSource))],
      changes: history.map((h) => ({
        timestamp: h.timestamp,
        field: h.fieldName,
        action: h.dataSource === 'ROLLBACK' ? 'rollback' : 'update',
        user: h.user,
        source: h.dataSource,
      })),
    };

    return lineage;
  }

  async getProvenanceStatistics(entityType?: string, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const where: any = {
      timestamp: { gte: since },
    };

    if (entityType) {
      where.entityType = entityType;
    }

    const [totalChanges, bySource, byUser] = await Promise.all([
      this.prisma.dataProvenance.count({ where }),
      this.prisma.dataProvenance.groupBy({
        by: ['dataSource'],
        where,
        _count: true,
      }),
      this.prisma.dataProvenance.groupBy({
        by: ['userId'],
        where,
        _count: true,
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    return {
      period: { days, since },
      totalChanges,
      bySource: bySource.map((s) => ({
        source: s.dataSource,
        count: s._count,
      })),
      topContributors: byUser.map((u) => ({
        userId: u.userId,
        changes: u._count,
      })),
    };
  }

  private generateProvenanceHash(entityType: string, entityId: string, fieldName: string, value: any): string {
    const crypto = require('crypto');
    const data = `${entityType}:${entityId}:${fieldName}:${JSON.stringify(value)}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }
}
