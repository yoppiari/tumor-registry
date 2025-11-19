import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { stringify } from 'csv-stringify/sync';
import { ReportData, ReportLayout } from '../interfaces/reports.interface';

@Injectable()
export class CsvGenerator {
  private readonly logger = new Logger(CsvGenerator.name);

  async generateReport(
    data: ReportData,
    layout: ReportLayout,
    options: {
      title?: string;
      filename?: string;
      outputPath?: string;
      includeHeaders?: boolean;
      delimiter?: string;
    } = {},
  ): Promise<{ filePath: string; fileSize: number }> {
    const filename = options.filename || `report_${Date.now()}.csv`;
    const outputPath = options.outputPath || path.join(process.cwd(), 'temp', 'reports');

    // Ensure directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const filePath = path.join(outputPath, filename);

    try {
      // Extract table data from layout or use provided data
      const tableSection = layout.sections.find(section => section.type === 'table');
      const csvData = tableSection?.content?.data || data;

      if (!Array.isArray(csvData) || csvData.length === 0) {
        throw new Error('No tabular data available for CSV export');
      }

      // Prepare CSV data
      const headers = options.includeHeaders !== false
        ? (tableSection?.content?.headers || Object.keys(csvData[0]))
        : undefined;

      const csvContent = stringify(csvData, {
        header: options.includeHeaders !== false,
        columns: headers?.map(header => ({ key: header, header })),
        delimiter: options.delimiter || ',',
        quoted: true,
        quoted_empty: true,
        escape: '"',
      });

      // Add title as comment if provided
      let finalContent = csvContent;
      if (options.title) {
        const titleComment = `# ${options.title}\n# Generated on ${new Date().toLocaleString()}\n\n`;
        finalContent = titleComment + csvContent;
      }

      // Write file
      fs.writeFileSync(filePath, finalContent, 'utf8');

      const stats = fs.statSync(filePath);
      this.logger.log(`CSV report generated: ${filePath} (${stats.size} bytes)`);

      return { filePath, fileSize: stats.size };
    } catch (error) {
      this.logger.error('Error generating CSV report', error);
      throw error;
    }
  }

  async generateMultiSheetCsv(
    data: ReportData,
    layout: ReportLayout,
    options: {
      title?: string;
      filename?: string;
      outputPath?: string;
    } = {},
  ): Promise<{ filePath: string; fileSize: number }> {
    const filename = options.filename || `multi_report_${Date.now()}.csv`;
    const outputPath = options.outputPath || path.join(process.cwd(), 'temp', 'reports');

    // Ensure directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const filePath = path.join(outputPath, filename);

    try {
      let finalContent = '';

      // Add title header if provided
      if (options.title) {
        finalContent += `# ${options.title}\n# Generated on ${new Date().toLocaleString()}\n\n`;
      }

      // Process each section that contains table data
      for (let i = 0; i < layout.sections.length; i++) {
        const section = layout.sections[i];

        if (section.type === 'table' && section.content?.data) {
          const sectionTitle = section.title || `Section ${i + 1}`;
          const sectionData = section.content.data;

          if (!Array.isArray(sectionData) || sectionData.length === 0) {
            continue;
          }

          // Add section separator
          finalContent += `\n# ${sectionTitle}\n`;

          const headers = section.content?.headers || Object.keys(sectionData[0]);

          const csvContent = stringify(sectionData, {
            header: true,
            columns: headers.map(header => ({ key: header, header })),
            delimiter: ',',
            quoted: true,
            quoted_empty: true,
            escape: '"',
          });

          finalContent += csvContent + '\n';
        } else if (section.type === 'summary' && section.content?.data) {
          // Add summary data as key-value pairs
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
          } else if (typeof summaryData === 'object') {
            const kvPairs = Object.entries(summaryData)
              .map(([key, value]) => `${key},${value}`)
              .join('\n');
            finalContent += kvPairs + '\n';
          }
        }
      }

      // Write file
      fs.writeFileSync(filePath, finalContent, 'utf8');

      const stats = fs.statSync(filePath);
      this.logger.log(`Multi-sheet CSV report generated: ${filePath} (${stats.size} bytes)`);

      return { filePath, fileSize: stats.size };
    } catch (error) {
      this.logger.error('Error generating multi-sheet CSV report', error);
      throw error;
    }
  }

  async generateFlatReport(
    data: ReportData,
    layout: ReportLayout,
    options: {
      title?: string;
      filename?: string;
      outputPath?: string;
      includeMetadata?: boolean;
    } = {},
  ): Promise<{ filePath: string; fileSize: number }> {
    const filename = options.filename || `flat_report_${Date.now()}.csv`;
    const outputPath = options.outputPath || path.join(process.cwd(), 'temp', 'reports');

    // Ensure directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const filePath = path.join(outputPath, filename);

    try {
      // Flatten all data from all sections
      const flattenedData: any[] = [];

      // Add report metadata
      if (options.includeMetadata !== false) {
        flattenedData.push({
          section: 'Metadata',
          field: 'Report Title',
          value: options.title || 'Generated Report',
          timestamp: new Date().toISOString(),
        });
      }

      // Process each section
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
          } else if (typeof sectionData === 'object') {
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

      // Generate CSV with flattened data
      const csvContent = stringify(flattenedData, {
        header: true,
        delimiter: ',',
        quoted: true,
        quoted_empty: true,
        escape: '"',
      });

      // Write file
      fs.writeFileSync(filePath, csvContent, 'utf8');

      const stats = fs.statSync(filePath);
      this.logger.log(`Flat CSV report generated: ${filePath} (${stats.size} bytes)`);

      return { filePath, fileSize: stats.size };
    } catch (error) {
      this.logger.error('Error generating flat CSV report', error);
      throw error;
    }
  }
}