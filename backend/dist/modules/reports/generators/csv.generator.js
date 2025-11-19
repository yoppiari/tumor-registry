"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CsvGenerator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvGenerator = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const sync_1 = require("csv-stringify/sync");
let CsvGenerator = CsvGenerator_1 = class CsvGenerator {
    constructor() {
        this.logger = new common_1.Logger(CsvGenerator_1.name);
    }
    async generateReport(data, layout, options = {}) {
        const filename = options.filename || `report_${Date.now()}.csv`;
        const outputPath = options.outputPath || path.join(process.cwd(), 'temp', 'reports');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        const filePath = path.join(outputPath, filename);
        try {
            const tableSection = layout.sections.find(section => section.type === 'table');
            const csvData = tableSection?.content?.data || data;
            if (!Array.isArray(csvData) || csvData.length === 0) {
                throw new Error('No tabular data available for CSV export');
            }
            const headers = options.includeHeaders !== false
                ? (tableSection?.content?.headers || Object.keys(csvData[0]))
                : undefined;
            const csvContent = (0, sync_1.stringify)(csvData, {
                header: options.includeHeaders !== false,
                columns: headers?.map(header => ({ key: header, header })),
                delimiter: options.delimiter || ',',
                quoted: true,
                quoted_empty: true,
                escape: '"',
            });
            let finalContent = csvContent;
            if (options.title) {
                const titleComment = `# ${options.title}\n# Generated on ${new Date().toLocaleString()}\n\n`;
                finalContent = titleComment + csvContent;
            }
            fs.writeFileSync(filePath, finalContent, 'utf8');
            const stats = fs.statSync(filePath);
            this.logger.log(`CSV report generated: ${filePath} (${stats.size} bytes)`);
            return { filePath, fileSize: stats.size };
        }
        catch (error) {
            this.logger.error('Error generating CSV report', error);
            throw error;
        }
    }
    async generateMultiSheetCsv(data, layout, options = {}) {
        const filename = options.filename || `multi_report_${Date.now()}.csv`;
        const outputPath = options.outputPath || path.join(process.cwd(), 'temp', 'reports');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        const filePath = path.join(outputPath, filename);
        try {
            let finalContent = '';
            if (options.title) {
                finalContent += `# ${options.title}\n# Generated on ${new Date().toLocaleString()}\n\n`;
            }
            for (let i = 0; i < layout.sections.length; i++) {
                const section = layout.sections[i];
                if (section.type === 'table' && section.content?.data) {
                    const sectionTitle = section.title || `Section ${i + 1}`;
                    const sectionData = section.content.data;
                    if (!Array.isArray(sectionData) || sectionData.length === 0) {
                        continue;
                    }
                    finalContent += `\n# ${sectionTitle}\n`;
                    const headers = section.content?.headers || Object.keys(sectionData[0]);
                    const csvContent = (0, sync_1.stringify)(sectionData, {
                        header: true,
                        columns: headers.map(header => ({ key: header, header })),
                        delimiter: ',',
                        quoted: true,
                        quoted_empty: true,
                        escape: '"',
                    });
                    finalContent += csvContent + '\n';
                }
                else if (section.type === 'summary' && section.content?.data) {
                    const sectionTitle = section.title || `Summary ${i + 1}`;
                    const summaryData = section.content.data;
                    finalContent += `\n# ${sectionTitle}\n`;
                    if (Array.isArray(summaryData)) {
                        for (const item of summaryData) {
                            if (typeof item === 'object' && item !== null) {
                                const kvPairs = Object.entries(item)
                                    .map(([key, value]) => `${key},${value}`)
                                    .join('\n');
                                finalContent += kvPairs + '\n';
                            }
                        }
                    }
                    else if (typeof summaryData === 'object') {
                        const kvPairs = Object.entries(summaryData)
                            .map(([key, value]) => `${key},${value}`)
                            .join('\n');
                        finalContent += kvPairs + '\n';
                    }
                }
            }
            fs.writeFileSync(filePath, finalContent, 'utf8');
            const stats = fs.statSync(filePath);
            this.logger.log(`Multi-sheet CSV report generated: ${filePath} (${stats.size} bytes)`);
            return { filePath, fileSize: stats.size };
        }
        catch (error) {
            this.logger.error('Error generating multi-sheet CSV report', error);
            throw error;
        }
    }
    async generateFlatReport(data, layout, options = {}) {
        const filename = options.filename || `flat_report_${Date.now()}.csv`;
        const outputPath = options.outputPath || path.join(process.cwd(), 'temp', 'reports');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        const filePath = path.join(outputPath, filename);
        try {
            const flattenedData = [];
            if (options.includeMetadata !== false) {
                flattenedData.push({
                    section: 'Metadata',
                    field: 'Report Title',
                    value: options.title || 'Generated Report',
                    timestamp: new Date().toISOString(),
                });
            }
            for (let i = 0; i < layout.sections.length; i++) {
                const section = layout.sections[i];
                const sectionName = section.title || `Section ${i + 1}`;
                if (section.content?.data) {
                    const sectionData = section.content.data;
                    if (Array.isArray(sectionData)) {
                        sectionData.forEach((item, index) => {
                            if (typeof item === 'object') {
                                Object.entries(item).forEach(([key, value]) => {
                                    flattenedData.push({
                                        section: sectionName,
                                        row: index + 1,
                                        field: key,
                                        value: typeof value === 'object' ? JSON.stringify(value) : value,
                                        timestamp: new Date().toISOString(),
                                    });
                                });
                            }
                        });
                    }
                    else if (typeof sectionData === 'object') {
                        Object.entries(sectionData).forEach(([key, value]) => {
                            flattenedData.push({
                                section: sectionName,
                                field: key,
                                value: typeof value === 'object' ? JSON.stringify(value) : value,
                                timestamp: new Date().toISOString(),
                            });
                        });
                    }
                }
            }
            const csvContent = (0, sync_1.stringify)(flattenedData, {
                header: true,
                delimiter: ',',
                quoted: true,
                quoted_empty: true,
                escape: '"',
            });
            fs.writeFileSync(filePath, csvContent, 'utf8');
            const stats = fs.statSync(filePath);
            this.logger.log(`Flat CSV report generated: ${filePath} (${stats.size} bytes)`);
            return { filePath, fileSize: stats.size };
        }
        catch (error) {
            this.logger.error('Error generating flat CSV report', error);
            throw error;
        }
    }
};
exports.CsvGenerator = CsvGenerator;
exports.CsvGenerator = CsvGenerator = CsvGenerator_1 = __decorate([
    (0, common_1.Injectable)()
], CsvGenerator);
//# sourceMappingURL=csv.generator.js.map