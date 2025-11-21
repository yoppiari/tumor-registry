import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(action: string, userId: string, details?: any): Promise<void> {
    this.logger.log(`Audit: ${action} by ${userId}`, details);
    // TODO: Implement actual audit logging to database
  }

  async logResearchAction(
    action: string,
    userId: string,
    researchId: string,
    details?: any,
  ): Promise<void> {
    await this.log(`Research ${action}`, userId, {
      researchId,
      ...details,
    });
  }
}
