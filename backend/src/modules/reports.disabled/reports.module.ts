import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { ReportHistoryService } from './services/report-history.service';
import { PdfGenerator } from './generators/pdf.generator';
import { ExcelGenerator } from './generators/excel.generator';
import { CsvGenerator } from './generators/csv.generator';
import { PrismaService } from '@/common/database/prisma.service';

@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportHistoryService,
    PdfGenerator,
    ExcelGenerator,
    CsvGenerator,
    PrismaService,
  ],
  exports: [
    ReportsService,
    ReportHistoryService,
    PdfGenerator,
    ExcelGenerator,
    CsvGenerator,
  ],
})
export class ReportsModule {}