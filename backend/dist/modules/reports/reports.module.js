"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const reports_controller_1 = require("./controllers/reports.controller");
const reports_service_1 = require("./services/reports.service");
const report_history_service_1 = require("./services/report-history.service");
const pdf_generator_1 = require("./generators/pdf.generator");
const excel_generator_1 = require("./generators/excel.generator");
const csv_generator_1 = require("./generators/csv.generator");
const prisma_service_1 = require("../../common/database/prisma.service");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        controllers: [reports_controller_1.ReportsController],
        providers: [
            reports_service_1.ReportsService,
            report_history_service_1.ReportHistoryService,
            pdf_generator_1.PdfGenerator,
            excel_generator_1.ExcelGenerator,
            csv_generator_1.CsvGenerator,
            prisma_service_1.PrismaService,
        ],
        exports: [
            reports_service_1.ReportsService,
            report_history_service_1.ReportHistoryService,
            pdf_generator_1.PdfGenerator,
            excel_generator_1.ExcelGenerator,
            csv_generator_1.CsvGenerator,
        ],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map