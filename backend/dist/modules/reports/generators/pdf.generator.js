"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PdfGenerator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfGenerator = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
let PdfGenerator = PdfGenerator_1 = class PdfGenerator {
    constructor() {
        this.logger = new common_1.Logger(PdfGenerator_1.name);
    }
    async generateReport(data, layout, options = {}) {
        const filename = options.filename || `report_${Date.now()}.pdf`;
        const outputPath = options.outputPath || path.join(process.cwd(), 'temp', 'reports');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        const filePath = path.join(outputPath, filename);
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 },
                });
                const stream = fs.createWriteStream(filePath);
                doc.pipe(stream);
                if (options.title) {
                    doc.fontSize(20).font('Helvetica-Bold').text(options.title, { align: 'center' });
                    doc.moveDown();
                }
                for (const section of layout.sections) {
                    await this.processSection(doc, section, data);
                }
                doc.fontSize(8).text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });
                doc.end();
                stream.on('finish', () => {
                    const stats = fs.statSync(filePath);
                    this.logger.log(`PDF report generated: ${filePath} (${stats.size} bytes)`);
                    resolve({ filePath, fileSize: stats.size });
                });
                stream.on('error', (error) => {
                    this.logger.error('Error generating PDF report', error);
                    reject(error);
                });
            }
            catch (error) {
                this.logger.error('Error creating PDF document', error);
                reject(error);
            }
        });
    }
    async processSection(doc, section, data) {
        doc.addPage();
        if (section.title) {
            doc.fontSize(16).font('Helvetica-Bold').text(section.title);
            doc.moveDown();
        }
        switch (section.type) {
            case 'header':
                await this.processHeaderSection(doc, section, data);
                break;
            case 'summary':
                await this.processSummarySection(doc, section, data);
                break;
            case 'table':
                await this.processTableSection(doc, section, data);
                break;
            case 'chart':
                await this.processChartSection(doc, section, data);
                break;
            case 'text':
                await this.processTextSection(doc, section, data);
                break;
            case 'footer':
                await this.processFooterSection(doc, section, data);
                break;
        }
        doc.moveDown();
    }
    async processHeaderSection(doc, section, data) {
        if (section.content?.title) {
            doc.fontSize(18).font('Helvetica-Bold').text(section.content.title, { align: 'center' });
        }
        if (section.content?.subtitle) {
            doc.fontSize(12).font('Helvetica').text(section.content.subtitle, { align: 'center' });
            doc.moveDown();
        }
        if (section.content?.metadata) {
            doc.fontSize(10).font('Helvetica');
            for (const [key, value] of Object.entries(section.content.metadata)) {
                doc.text(`${key}: ${value}`);
            }
        }
    }
    async processSummarySection(doc, section, data) {
        const summaryData = section.content?.data || data;
        if (Array.isArray(summaryData)) {
            for (const item of summaryData) {
                if (typeof item === 'object' && item !== null) {
                    for (const [key, value] of Object.entries(item)) {
                        doc.fontSize(12).font('Helvetica-Bold').text(`${key}:`);
                        doc.fontSize(10).font('Helvetica').text(`${value}`).moveDown();
                    }
                }
            }
        }
        else if (typeof summaryData === 'object') {
            for (const [key, value] of Object.entries(summaryData)) {
                doc.fontSize(12).font('Helvetica-Bold').text(`${key}:`);
                doc.fontSize(10).font('Helvetica').text(`${value}`).moveDown();
            }
        }
    }
    async processTableSection(doc, section, data) {
        const tableData = section.content?.data || data;
        if (!Array.isArray(tableData) || tableData.length === 0) {
            doc.fontSize(10).font('Helvetica-Italic').text('No data available');
            return;
        }
        const headers = section.content?.headers || Object.keys(tableData[0]);
        const columnWidths = this.calculateColumnWidths(doc, tableData, headers);
        let xPos = 50;
        doc.fontSize(10).font('Helvetica-Bold');
        for (let i = 0; i < headers.length; i++) {
            doc.text(headers[i], xPos, doc.y, { width: columnWidths[i] });
            xPos += columnWidths[i];
        }
        doc.moveDown();
        doc.fontSize(9).font('Helvetica');
        for (const row of tableData) {
            xPos = 50;
            const originalY = doc.y;
            for (let i = 0; i < headers.length; i++) {
                const cellValue = row[headers[i]] || '';
                doc.text(String(cellValue), xPos, originalY, { width: columnWidths[i] });
                xPos += columnWidths[i];
            }
            doc.moveDown();
            if (doc.y > 700) {
                doc.addPage();
            }
        }
    }
    async processChartSection(doc, section, data) {
        const chartConfig = section.content?.config;
        if (chartConfig?.title) {
            doc.fontSize(14).font('Helvetica-Bold').text(chartConfig.title);
            doc.moveDown();
        }
        const chartWidth = 400;
        const chartHeight = 300;
        const chartX = (doc.page.width - chartWidth) / 2;
        doc.rect(chartX, doc.y, chartWidth, chartHeight).stroke();
        doc.fontSize(12).font('Helvetica-Italic').text('Chart Placeholder', chartX, doc.y + chartHeight / 2 - 10, {
            width: chartWidth,
            align: 'center',
        });
        if (section.content?.description) {
            doc.moveDown();
            doc.fontSize(10).font('Helvetica').text(section.content.description);
        }
        const chartData = section.content?.data;
        if (chartData && Array.isArray(chartData)) {
            doc.moveDown();
            doc.fontSize(10).font('Helvetica-Bold').text('Chart Data Summary:');
            for (const item of chartData.slice(0, 10)) {
                if (typeof item === 'object') {
                    const values = Object.values(item).join(' - ');
                    doc.fontSize(9).font('Helvetica').text(values);
                }
            }
            if (chartData.length > 10) {
                doc.fontSize(9).font('Helvetica-Italic').text(`... and ${chartData.length - 10} more items`);
            }
        }
    }
    async processTextSection(doc, section, data) {
        const textContent = section.content?.text || '';
        doc.fontSize(11).font('Helvetica');
        const lines = textContent.split('\n');
        for (const line of lines) {
            if (line.trim()) {
                doc.text(line.trim());
            }
            else {
                doc.moveDown();
            }
        }
    }
    async processFooterSection(doc, section, data) {
        doc.fontSize(8).font('Helvetica-Italic');
        const footerContent = section.content || {};
        if (footerContent.text) {
            doc.text(footerContent.text, { align: 'center' });
        }
        if (footerContent.pageNumbers) {
            const totalPages = doc.bufferedPageRange().count;
            for (let i = 0; i < totalPages; i++) {
                doc.switchToPage(i);
                doc.text(`Page ${i + 1} of ${totalPages}`, doc.page.width - 100, doc.page.height - 50, { align: 'right' });
            }
        }
    }
    calculateColumnWidths(doc, data, headers) {
        const pageWidth = doc.page.width - 100;
        const columnCount = headers.length;
        const minColumnWidth = 50;
        const contentWidths = [];
        for (const header of headers) {
            doc.fontSize(10).font('Helvetica-Bold');
            const headerWidth = doc.widthOfString(header);
            let maxContentWidth = headerWidth;
            for (let i = 0; i < Math.min(10, data.length); i++) {
                const content = String(data[i]?.[header] || '');
                doc.fontSize(9).font('Helvetica');
                const contentWidth = doc.widthOfString(content);
                maxContentWidth = Math.max(maxContentWidth, contentWidth);
            }
            contentWidths.push(Math.max(maxContentWidth, minColumnWidth));
        }
        const totalContentWidth = contentWidths.reduce((sum, width) => sum + width, 0);
        if (totalContentWidth <= pageWidth) {
            return contentWidths;
        }
        const scale = pageWidth / totalContentWidth;
        return contentWidths.map(width => width * scale);
    }
};
exports.PdfGenerator = PdfGenerator;
exports.PdfGenerator = PdfGenerator = PdfGenerator_1 = __decorate([
    (0, common_1.Injectable)()
], PdfGenerator);
//# sourceMappingURL=pdf.generator.js.map