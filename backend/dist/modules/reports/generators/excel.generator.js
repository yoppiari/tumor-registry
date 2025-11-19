"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ExcelGenerator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelGenerator = void 0;
const common_1 = require("@nestjs/common");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
let ExcelGenerator = ExcelGenerator_1 = class ExcelGenerator {
    constructor() {
        this.logger = new common_1.Logger(ExcelGenerator_1.name);
    }
    async generateReport(data, layout, options = {}) {
        const filename = options.filename || `report_${Date.now()}.xlsx`;
        const outputPath = options.outputPath || path.join(process.cwd(), 'temp', 'reports');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        const filePath = path.join(outputPath, filename);
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'INAMSOS Tumor Registry';
            workbook.created = new Date();
            workbook.modified = new Date();
            for (let i = 0; i < layout.sections.length; i++) {
                const section = layout.sections[i];
                const sheetName = this.getSheetName(section.title || `Section ${i + 1}`);
                const worksheet = workbook.addWorksheet(sheetName);
                await this.processWorksheet(worksheet, section, data, options);
            }
            await this.addSummarySheet(workbook, data, layout, options);
            await workbook.xlsx.writeFile(filePath);
            const stats = fs.statSync(filePath);
            this.logger.log(`Excel report generated: ${filePath} (${stats.size} bytes)`);
            return { filePath, fileSize: stats.size };
        }
        catch (error) {
            this.logger.error('Error generating Excel report', error);
            throw error;
        }
    }
    async processWorksheet(worksheet, section, data, options) {
        switch (section.type) {
            case 'header':
                await this.processHeaderWorksheet(worksheet, section, data, options);
                break;
            case 'summary':
                await this.processSummaryWorksheet(worksheet, section, data, options);
                break;
            case 'table':
                await this.processTableWorksheet(worksheet, section, data, options);
                break;
            case 'chart':
                if (options.includeCharts) {
                    await this.processChartWorksheet(worksheet, section, data, options);
                }
                else {
                    await this.processChartDataWorksheet(worksheet, section, data, options);
                }
                break;
            case 'text':
                await this.processTextWorksheet(worksheet, section, data, options);
                break;
            default:
                await this.processGenericWorksheet(worksheet, section, data, options);
        }
        worksheet.columns.forEach((column) => {
            if (column.header) {
                column.width = Math.max(column.header.toString().length + 5, 15, ...column.values?.map((val) => val?.toString().length + 2) || []);
            }
        });
    }
    async processHeaderWorksheet(worksheet, section, data, options) {
        let rowIndex = 1;
        if (options.title) {
            worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
            const titleCell = worksheet.getCell(`A${rowIndex}`);
            titleCell.value = options.title;
            titleCell.font = { size: 18, bold: true };
            titleCell.alignment = { horizontal: 'center' };
            rowIndex++;
        }
        if (section.content?.title) {
            worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
            const subtitleCell = worksheet.getCell(`A${rowIndex}`);
            subtitleCell.value = section.content.title;
            subtitleCell.font = { size: 14, bold: true };
            subtitleCell.alignment = { horizontal: 'center' };
            rowIndex++;
        }
        if (section.content?.metadata) {
            rowIndex++;
            for (const [key, value] of Object.entries(section.content.metadata)) {
                worksheet.getCell(`A${rowIndex}`).value = key;
                worksheet.getCell(`B${rowIndex}`).value = value;
                worksheet.getCell(`A${rowIndex}`).font = { bold: true };
                rowIndex++;
            }
        }
        rowIndex += 2;
        worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
        const timestampCell = worksheet.getCell(`A${rowIndex}`);
        timestampCell.value = `Generated on ${new Date().toLocaleString()}`;
        timestampCell.font = { italic: true, size: 10 };
        timestampCell.alignment = { horizontal: 'right' };
    }
    async processSummaryWorksheet(worksheet, section, data, options) {
        const summaryData = section.content?.data || data;
        let rowIndex = 1;
        if (section.title) {
            worksheet.getCell(`A${rowIndex}`).value = section.title;
            worksheet.getCell(`A${rowIndex}`).font = { size: 14, bold: true };
            rowIndex += 2;
        }
        if (Array.isArray(summaryData)) {
            worksheet.columns = [
                { header: 'Metric', key: 'metric', width: 20 },
                { header: 'Value', key: 'value', width: 15 },
                { header: 'Description', key: 'description', width: 30 },
            ];
            for (const item of summaryData) {
                if (typeof item === 'object' && item !== null) {
                    worksheet.addRow({
                        metric: item.metric || item.name || '',
                        value: item.value || item.count || '',
                        description: item.description || '',
                    });
                }
            }
        }
        else if (typeof summaryData === 'object') {
            worksheet.columns = [
                { header: 'Property', key: 'property', width: 20 },
                { header: 'Value', key: 'value', width: 25 },
                { header: 'Notes', key: 'notes', width: 30 },
            ];
            for (const [key, value] of Object.entries(summaryData)) {
                worksheet.addRow({
                    property: key,
                    value: typeof value === 'object' ? JSON.stringify(value) : String(value),
                    notes: '',
                });
            }
        }
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6E6' },
        };
    }
    async processTableWorksheet(worksheet, section, data, options) {
        const tableData = section.content?.data || data;
        if (!Array.isArray(tableData) || tableData.length === 0) {
            worksheet.getCell('A1').value = 'No data available';
            return;
        }
        const headers = section.content?.headers || Object.keys(tableData[0]);
        let rowIndex = 1;
        if (section.title) {
            worksheet.getCell(`A${rowIndex}`).value = section.title;
            worksheet.getCell(`A${rowIndex}`).font = { size: 14, bold: true };
            rowIndex += 2;
        }
        worksheet.columns = headers.map(header => ({
            header,
            key: header,
            width: Math.max(header.length, 15),
        }));
        for (const row of tableData) {
            const rowData = {};
            for (const header of headers) {
                rowData[header] = row[header] !== undefined ? row[header] : '';
            }
            worksheet.addRow(rowData);
        }
        const headerRow = worksheet.getRow(rowIndex);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6E6' },
        };
        if (section.content?.conditionalFormatting) {
            this.applyConditionalFormatting(worksheet, section.content.conditionalFormatting, headers);
        }
        const tableRange = worksheet.getRange(rowIndex, 1, rowIndex + tableData.length, headers.length);
        tableRange.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            inside: { style: 'thin' },
        };
    }
    async processChartDataWorksheet(worksheet, section, data, options) {
        const chartData = section.content?.data || data;
        let rowIndex = 1;
        if (section.title) {
            worksheet.getCell(`A${rowIndex}`).value = section.title;
            worksheet.getCell(`A${rowIndex}`).font = { size: 14, bold: true };
            rowIndex += 2;
        }
        if (section.content?.description) {
            worksheet.getCell(`A${rowIndex}`).value = section.content.description;
            worksheet.getCell(`A${rowIndex}`).font = { italic: true };
            rowIndex += 2;
        }
        if (Array.isArray(chartData) && chartData.length > 0) {
            const headers = Object.keys(chartData[0]);
            worksheet.columns = headers.map(header => ({
                header,
                key: header,
                width: Math.max(header.length, 15),
            }));
            for (const item of chartData) {
                worksheet.addRow(item);
            }
            const headerRow = worksheet.getRow(rowIndex);
            headerRow.font = { bold: true };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE6E6E6' },
            };
        }
    }
    async processTextWorksheet(worksheet, section, data, options) {
        const textContent = section.content?.text || '';
        let rowIndex = 1;
        if (section.title) {
            worksheet.getCell(`A${rowIndex}`).value = section.title;
            worksheet.getCell(`A${rowIndex}`).font = { size: 14, bold: true };
            rowIndex += 2;
        }
        const lines = textContent.split('\n');
        for (const line of lines) {
            if (line.trim()) {
                worksheet.getCell(`A${rowIndex}`).value = line.trim();
                worksheet.getCell(`A${rowIndex}`).alignment = { wrapText: true };
                rowIndex++;
            }
        }
    }
    async processGenericWorksheet(worksheet, section, data, options) {
        let rowIndex = 1;
        if (section.title) {
            worksheet.getCell(`A${rowIndex}`).value = section.title;
            worksheet.getCell(`A${rowIndex}`).font = { size: 14, bold: true };
            rowIndex += 2;
        }
        worksheet.getCell(`A${rowIndex}`).value = 'Section Data:';
        worksheet.getCell(`A${rowIndex}`).font = { bold: true };
        rowIndex++;
        if (section.content) {
            worksheet.getCell(`A${rowIndex}`).value = JSON.stringify(section.content, null, 2);
            worksheet.getCell(`A${rowIndex}`).font = { name: 'Courier New' };
        }
    }
    async addSummarySheet(workbook, data, layout, options) {
        const summaryWorksheet = workbook.addWorksheet('Summary');
        let rowIndex = 1;
        summaryWorksheet.getCell(`A${rowIndex}`).value = 'Report Summary';
        summaryWorksheet.getCell(`A${rowIndex}`).font = { size: 16, bold: true };
        rowIndex += 2;
        summaryWorksheet.getCell(`A${rowIndex}`).value = 'Title:';
        summaryWorksheet.getCell(`B${rowIndex}`).value = options.title || 'Generated Report';
        rowIndex++;
        summaryWorksheet.getCell(`A${rowIndex}`).value = 'Generated:';
        summaryWorksheet.getCell(`B${rowIndex}`).value = new Date().toLocaleString();
        rowIndex++;
        summaryWorksheet.getCell(`A${rowIndex}`).value = 'Sections:';
        summaryWorksheet.getCell(`B${rowIndex}`).value = layout.sections.length;
        rowIndex += 2;
        summaryWorksheet.getCell(`A${rowIndex}`).value = 'Sections Overview';
        summaryWorksheet.getCell(`A${rowIndex}`).font = { bold: true };
        rowIndex++;
        summaryWorksheet.columns = [
            { header: 'Section', key: 'section', width: 20 },
            { header: 'Type', key: 'type', width: 15 },
            { header: 'Title', key: 'title', width: 30 },
        ];
        for (const section of layout.sections) {
            summaryWorksheet.addRow({
                section: `Section ${layout.sections.indexOf(section) + 1}`,
                type: section.type,
                title: section.title || 'Untitled',
            });
        }
        const headerRow = summaryWorksheet.getRow(rowIndex);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6E6' },
        };
    }
    getSheetName(title) {
        const cleanName = title
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .substring(0, 31)
            .trim();
        return cleanName || 'Sheet';
    }
    applyConditionalFormatting(worksheet, formatting, headers) {
    }
};
exports.ExcelGenerator = ExcelGenerator;
exports.ExcelGenerator = ExcelGenerator = ExcelGenerator_1 = __decorate([
    (0, common_1.Injectable)()
], ExcelGenerator);
//# sourceMappingURL=excel.generator.js.map