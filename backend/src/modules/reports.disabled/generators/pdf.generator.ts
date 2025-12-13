import { Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { ReportData, ReportLayout, ChartConfig } from '../interfaces/reports.interface';

@Injectable()
export class PdfGenerator {
  private readonly logger = new Logger(PdfGenerator.name);

  async generateReport(
    data: ReportData,
    layout: ReportLayout,
    options: {
      title?: string;
      filename?: string;
      outputPath?: string;
    } = {},
  ): Promise<{ filePath: string; fileSize: number }> {
    const filename = options.filename || `report_${Date.now()}.pdf`;
    const outputPath = options.outputPath || path.join(process.cwd(), 'temp', 'reports');

    // Ensure directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const filePath = path.join(outputPath, filename);

    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Add title if provided
        if (options.title) {
          doc.fontSize(20).font('Helvetica-Bold').text(options.title, { align: 'center' });
          doc.moveDown();
        }

        // Process layout sections
        for (const section of layout.sections) {
          await this.processSection(doc, section, data);
        }

        // Add footer
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
      } catch (error) {
        this.logger.error('Error creating PDF document', error);
        reject(error);
      }
    });
  }

  private async processSection(doc: PDFKit.PDFDocument, section: any, data: ReportData): Promise<void> {
    doc.addPage();

    // Section title
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

  private async processHeaderSection(doc: PDFKit.PDFDocument, section: any, data: ReportData): Promise<void> {
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

  private async processSummarySection(doc: PDFKit.PDFDocument, section: any, data: ReportData): Promise<void> {
    const summaryData = section.content?.data || data;

    if (Array.isArray(summaryData)) {
      // Display as key-value pairs
      for (const item of summaryData) {
        if (typeof item === 'object' && item !== null) {
          for (const [key, value] of Object.entries(item)) {
            doc.fontSize(12).font('Helvetica-Bold').text(`${key}:`);
            doc.fontSize(10).font('Helvetica').text(`${value}`).moveDown();
          }
        }
      }
    } else if (typeof summaryData === 'object') {
      // Display object properties
      for (const [key, value] of Object.entries(summaryData)) {
        doc.fontSize(12).font('Helvetica-Bold').text(`${key}:`);
        doc.fontSize(10).font('Helvetica').text(`${value}`).moveDown();
      }
    }
  }

  private async processTableSection(doc: PDFKit.PDFDocument, section: any, data: ReportData): Promise<void> {
    const tableData = section.content?.data || data;

    if (!Array.isArray(tableData) || tableData.length === 0) {
      doc.fontSize(10).font('Helvetica-Italic').text('No data available');
      return;
    }

    const headers = section.content?.headers || Object.keys(tableData[0]);
    const columnWidths = this.calculateColumnWidths(doc, tableData, headers);

    // Draw table headers
    let xPos = 50;
    doc.fontSize(10).font('Helvetica-Bold');

    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], xPos, doc.y, { width: columnWidths[i] });
      xPos += columnWidths[i];
    }

    doc.moveDown();

    // Draw table rows
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

      // Add some spacing between rows
      if (doc.y > 700) {
        doc.addPage();
      }
    }
  }

  private async processChartSection(doc: PDFKit.PDFDocument, section: any, data: ReportData): Promise<void> {
    // For PDF charts, we'll add a placeholder and text description
    const chartConfig = section.content?.config;

    if (chartConfig?.title) {
      doc.fontSize(14).font('Helvetica-Bold').text(chartConfig.title);
      doc.moveDown();
    }

    // Add chart placeholder
    const chartWidth = 400;
    const chartHeight = 300;
    const chartX = (doc.page.width - chartWidth) / 2;

    doc.rect(chartX, doc.y, chartWidth, chartHeight).stroke();
    doc.fontSize(12).font('Helvetica-Italic').text('Chart Placeholder', chartX, doc.y + chartHeight / 2 - 10, {
      width: chartWidth,
      align: 'center',
    });

    // Add chart description or data summary
    if (section.content?.description) {
      doc.moveDown();
      doc.fontSize(10).font('Helvetica').text(section.content.description);
    }

    // Add basic chart data if available
    const chartData = section.content?.data;
    if (chartData && Array.isArray(chartData)) {
      doc.moveDown();
      doc.fontSize(10).font('Helvetica-Bold').text('Chart Data Summary:');

      for (const item of chartData.slice(0, 10)) { // Limit to first 10 items
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

  private async processTextSection(doc: PDFKit.PDFDocument, section: any, data: ReportData): Promise<void> {
    const textContent = section.content?.text || '';

    doc.fontSize(11).font('Helvetica');

    // Handle multi-line text
    const lines = textContent.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        doc.text(line.trim());
      } else {
        doc.moveDown();
      }
    }
  }

  private async processFooterSection(doc: PDFKit.PDFDocument, section: any, data: ReportData): Promise<void> {
    doc.fontSize(8).font('Helvetica-Italic');

    const footerContent = section.content || {};

    if (footerContent.text) {
      doc.text(footerContent.text, { align: 'center' });
    }

    if (footerContent.pageNumbers) {
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.text(
          `Page ${i + 1} of ${totalPages}`,
          doc.page.width - 100,
          doc.page.height - 50,
          { align: 'right' },
        );
      }
    }
  }

  private calculateColumnWidths(doc: PDFKit.PDFDocument, data: any[], headers: string[]): number[] {
    const pageWidth = doc.page.width - 100; // Subtract margins
    const columnCount = headers.length;
    const minColumnWidth = 50;

    // Calculate minimum width needed for each column based on content
    const contentWidths: number[] = [];

    for (const header of headers) {
      doc.fontSize(10).font('Helvetica-Bold');
      const headerWidth = doc.widthOfString(header);

      let maxContentWidth = headerWidth;

      // Check first 10 rows for content width
      for (let i = 0; i < Math.min(10, data.length); i++) {
        const content = String(data[i]?.[header] || '');
        doc.fontSize(9).font('Helvetica');
        const contentWidth = doc.widthOfString(content);
        maxContentWidth = Math.max(maxContentWidth, contentWidth);
      }

      contentWidths.push(Math.max(maxContentWidth, minColumnWidth));
    }

    // Adjust widths to fit page
    const totalContentWidth = contentWidths.reduce((sum, width) => sum + width, 0);

    if (totalContentWidth <= pageWidth) {
      return contentWidths;
    }

    // Scale down proportionally
    const scale = pageWidth / totalContentWidth;
    return contentWidths.map(width => width * scale);
  }
}