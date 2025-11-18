import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { ImagingModality, ExamStatus, ContrastType, UrgencyLevel } from '@prisma/client';

@Injectable()
export class RadiologyService {
  private readonly logger = new Logger(RadiologyService.name);

  constructor(private prisma: PrismaService) {}

  async createImagingOrder(orderData: {
    patientId: string;
    orderingPhysicianId: string;
    modality: ImagingModality;
    bodyPart: string;
    clinicalIndication?: string;
    contrastType?: ContrastType;
    urgency: UrgencyLevel;
    requestedDate: Date;
    notes?: string;
  }) {
    try {
      const order = await this.prisma.radiologyOrder.create({
        data: {
          patientId: orderData.patientId,
          orderingPhysicianId: orderData.orderingPhysicianId,
          modality: orderData.modality,
          bodyPart: orderData.bodyPart,
          clinicalIndication: orderData.clinicalIndication,
          contrastType: orderData.contrastType || 'NONE',
          urgency: orderData.urgency,
          requestedDate: orderData.requestedDate,
          status: 'REQUESTED',
          notes: orderData.notes,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
            },
          },
          orderingPhysician: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      this.logger.log(`Imaging order created: ${order.modality} ${order.bodyPart} for patient ${order.patient.name}`);
      return order;
    } catch (error) {
      this.logger.error('Error creating imaging order', error);
      throw error;
    }
  }

  async updateRadiologyReport(orderId: string, reportData: {
    findings?: string;
    impression?: string;
    recommendation?: string;
    radiologistId?: string;
    reportDate?: Date;
    imagesCaptured?: number;
    contrastAdministered?: boolean;
    contrastAmount?: number;
    complications?: string;
    technique?: string;
    comparison?: string;
    biRadsScore?: number;
    notes?: string;
  }) {
    try {
      const order = await this.prisma.radiologyOrder.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException(`Radiology order with ID ${orderId} not found`);
      }

      const updatedOrder = await this.prisma.radiologyOrder.update({
        where: { id: orderId },
        data: {
          ...(reportData.findings !== undefined && { findings: reportData.findings }),
          ...(reportData.impression !== undefined && { impression: reportData.impression }),
          ...(reportData.recommendation !== undefined && { recommendation: reportData.recommendation }),
          ...(reportData.radiologistId !== undefined && { radiologistId: reportData.radiologistId }),
          ...(reportData.reportDate !== undefined && { reportDate: reportData.reportDate }),
          ...(reportData.imagesCaptured !== undefined && { imagesCaptured: reportData.imagesCaptured }),
          ...(reportData.contrastAdministered !== undefined && { contrastAdministered: reportData.contrastAdministered }),
          ...(reportData.contrastAmount !== undefined && { contrastAmount: reportData.contrastAmount }),
          ...(reportData.complications !== undefined && { complications: reportData.complications }),
          ...(reportData.technique !== undefined && { technique: reportData.technique }),
          ...(reportData.comparison !== undefined && { comparison: reportData.comparison }),
          ...(reportData.biRadsScore !== undefined && { biRadsScore: reportData.biRadsScore }),
          ...(reportData.notes !== undefined && { notes: reportData.notes }),
          status: reportData.radiologistId ? 'REPORTED' : 'COMPLETED',
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
            },
          },
          radiologist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      this.logger.log(`Radiology report updated for order: ${orderId}`);

      // Create critical finding alert if present
      if (this.hasCriticalFindings(reportData.findings, reportData.impression)) {
        await this.createCriticalFindingAlert(updatedOrder);
      }

      return updatedOrder;
    } catch (error) {
      this.logger.error(`Error updating radiology report for order: ${orderId}`, error);
      throw error;
    }
  }

  async getImagingOrdersByPatient(patientId: string, options: {
    modality?: ImagingModality;
    status?: ExamStatus;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { patientId };

      if (options.modality) {
        where.modality = options.modality;
      }

      if (options.status) {
        where.status = options.status;
      }

      if (options.dateFrom || options.dateTo) {
        where.requestedDate = {};
        if (options.dateFrom) {
          where.requestedDate.gte = options.dateFrom;
        }
        if (options.dateTo) {
          where.requestedDate.lte = options.dateTo;
        }
      }

      const [orders, total] = await Promise.all([
        this.prisma.radiologyOrder.findMany({
          where,
          include: {
            orderingPhysician: {
              select: {
                id: true,
                name: true,
              },
            },
            radiologist: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [
            { requestedDate: 'desc' },
          ],
          skip,
          take: limit,
        }),
        this.prisma.radiologyOrder.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        orders: orders.map(order => ({
          ...order,
          modalityDisplay: this.getModalityDisplay(order.modality),
          statusDisplay: this.getStatusDisplay(order.status),
          urgencyDisplay: this.getUrgencyDisplay(order.urgency),
          contrastTypeDisplay: this.getContrastTypeDisplay(order.contrastType),
        })),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error(`Error getting imaging orders for patient: ${patientId}`, error);
      throw error;
    }
  }

  async getImagingOrderById(orderId: string) {
    try {
      const order = await this.prisma.radiologyOrder.findUnique({
        where: { id: orderId },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
              dateOfBirth: true,
              gender: true,
            },
          },
          orderingPhysician: {
            select: {
              id: true,
              name: true,
            },
          },
          radiologist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Radiology order with ID ${orderId} not found`);
      }

      return {
        ...order,
        patientAge: this.calculatePatientAge(order.patient.dateOfBirth),
        modalityDisplay: this.getModalityDisplay(order.modality),
        statusDisplay: this.getStatusDisplay(order.status),
        urgencyDisplay: this.getUrgencyDisplay(order.urgency),
        contrastTypeDisplay: this.getContrastTypeDisplay(order.contrastType),
        radiationDoseEstimate: this.estimateRadiationDose(order.modality),
      };
    } catch (error) {
      this.logger.error(`Error getting imaging order by ID: ${orderId}`, error);
      throw error;
    }
  }

  async getRadiologyStatistics(centerId?: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    try {
      const where: any = {};

      if (centerId) {
        where.patient = { centerId };
      }

      if (dateFrom || dateTo) {
        where.requestedDate = {};
        if (dateFrom) {
          where.requestedDate.gte = dateFrom;
        }
        if (dateTo) {
          where.requestedDate.lte = dateTo;
        }
      }

      const [
        totalOrders,
        requestedOrders,
        scheduledOrders,
        completedOrders,
        reportedOrders,
        cancelledOrders,
        urgentOrders,
        contrastStudies,
        ordersByModality,
        ordersByMonth,
      ] = await Promise.all([
        this.prisma.radiologyOrder.count({ where }),
        this.prisma.radiologyOrder.count({ where: { ...where, status: 'REQUESTED' } }),
        this.prisma.radiologyOrder.count({ where: { ...where, status: 'SCHEDULED' } }),
        this.prisma.radiologyOrder.count({ where: { ...where, status: 'COMPLETED' } }),
        this.prisma.radiologyOrder.count({ where: { ...where, status: 'REPORTED' } }),
        this.prisma.radiologyOrder.count({ where: { ...where, status: 'CANCELLED' } }),
        this.prisma.radiologyOrder.count({ where: { ...where, urgency: 'URGENT' } }),
        this.prisma.radiologyOrder.count({ where: { ...where, contrastType: { not: 'NONE' } } }),
        this.getOrdersByModalityStatistics(where),
        this.getOrdersByMonthStatistics(where),
      ]);

      return {
        totalOrders,
        requestedOrders,
        scheduledOrders,
        completedOrders,
        reportedOrders,
        cancelledOrders,
        urgentOrders,
        contrastStudies,
        contrastStudyRate: totalOrders > 0 ? (contrastStudies / totalOrders * 100).toFixed(2) : 0,
        ordersByModality,
        ordersByMonth,
      };
    } catch (error) {
      this.logger.error('Error getting radiology statistics', error);
      throw error;
    }
  }

  async getPendingStudies(centerId?: string): Promise<any[]> {
    try {
      const where: any = {
        status: { in: ['REQUESTED', 'SCHEDULED'] },
      };

      if (centerId) {
        where.patient = { centerId };
      }

      const orders = await this.prisma.radiologyOrder.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
            },
          },
          orderingPhysician: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [
          { urgency: 'desc' },
          { requestedDate: 'asc' },
        ],
      });

      return orders.map(order => ({
        ...order,
        modalityDisplay: this.getModalityDisplay(order.modality),
        statusDisplay: this.getStatusDisplay(order.status),
        urgencyDisplay: this.getUrgencyDisplay(order.urgency),
        daysSinceRequest: Math.ceil((new Date().getTime() - order.requestedDate.getTime()) / (1000 * 60 * 60 * 24)),
      }));
    } catch (error) {
      this.logger.error('Error getting pending studies', error);
      throw error;
    }
  }

  async updateImagingOrderStatus(orderId: string, status: ExamStatus, updatedBy?: string, scheduledDate?: Date) {
    try {
      const updateData: any = { status };

      if (status === 'SCHEDULED' && scheduledDate) {
        updateData.scheduledDate = scheduledDate;
      } else if (status === 'COMPLETED') {
        updateData.completedDate = new Date();
        updateData.performedBy = updatedBy;
      } else if (status === 'REPORTED') {
        updateData.reportDate = new Date();
      }

      const updatedOrder = await this.prisma.radiologyOrder.update({
        where: { id: orderId },
        data: updateData,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      this.logger.log(`Imaging order status updated: ${orderId} -> ${status}`);
      return updatedOrder;
    } catch (error) {
      this.logger.error(`Error updating imaging order status: ${orderId}`, error);
      throw error;
    }
  }

  async getPatientRadiationDoseTracking(patientId: string): Promise<any> {
    try {
      const orders = await this.prisma.radiologyOrder.findMany({
        where: {
          patientId,
          status: 'REPORTED',
          modality: { in: ['CT', 'PET_CT', 'SPECT_CT', 'INTERVENTIONAL'] },
        },
        select: {
          id: true,
          modality: true,
          bodyPart: true,
          reportDate: true,
        },
        orderBy: { reportDate: 'desc' },
      });

      const totalDose = orders.reduce((sum, order) => {
        return sum + this.estimateRadiationDose(order.modality);
      }, 0);

      return {
        totalStudies: orders.length,
        totalEstimatedDose: totalDose,
        studies: orders.map(order => ({
          ...order,
          modalityDisplay: this.getModalityDisplay(order.modality),
          estimatedDose: this.estimateRadiationDose(order.modality),
        })),
        annualDoseLimit: this.getAnnualDoseLimit(),
        riskLevel: this.getRadiationRiskLevel(totalDose),
      };
    } catch (error) {
      this.logger.error(`Error getting radiation dose tracking for patient: ${patientId}`, error);
      throw error;
    }
  }

  private async createCriticalFindingAlert(order: any) {
    try {
      await this.prisma.alert.create({
        data: {
          patientId: order.patientId,
          type: 'RADIOLOGY_CRITICAL',
          severity: 'CRITICAL',
          title: `Critical Radiology Finding: ${this.getModalityDisplay(order.modality)} ${order.bodyPart}`,
          message: `Critical findings detected in ${order.modality} ${order.bodyPart}. Immediate attention required.`,
          referenceId: order.id,
          status: 'ACTIVE',
        },
      });

      this.logger.log(`Critical finding alert created for imaging order: ${order.id}`);
    } catch (error) {
      this.logger.error('Error creating critical finding alert', error);
      // Don't throw error to avoid breaking the main workflow
    }
  }

  private hasCriticalFindings(findings?: string, impression?: string): boolean {
    const criticalKeywords = [
      'critical', 'emergency', 'urgent', 'immediate', 'life-threatening',
      'mass', 'tumor', 'malignancy', 'cancer', 'metastasis', 'hemorrhage',
      'bleeding', 'fracture', 'dislocation', 'obstruction', 'perforation',
      'infarct', 'stroke', 'pulmonary embolism', 'aortic dissection'
    ];

    const text = `${findings || ''} ${impression || ''}`.toLowerCase();
    return criticalKeywords.some(keyword => text.includes(keyword));
  }

  private calculatePatientAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  private getModalityDisplay(modality: ImagingModality): string {
    const displayMap = {
      'XRAY': 'X-Ray',
      'CT': 'CT Scan',
      'MRI': 'MRI',
      'ULTRASOUND': 'Ultrasound',
      'PET': 'PET Scan',
      'PET_CT': 'PET-CT',
      'SPECT': 'SPECT',
      'SPECT_CT': 'SPECT-CT',
      'MAMMOGRAPHY': 'Mammography',
      'INTERVENTIONAL': 'Interventional Radiology',
      'NUCLEAR_MEDICINE': 'Nuclear Medicine',
      'FLUOROSCOPY': 'Fluoroscopy',
      'ANGIOGRAPHY': 'Angiography',
      'OTHER': 'Other',
    };

    return displayMap[modality] || modality;
  }

  private getStatusDisplay(status: ExamStatus): string {
    const displayMap = {
      'REQUESTED': 'Requested',
      'SCHEDULED': 'Scheduled',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'REPORTED': 'Reported',
      'CANCELLED': 'Cancelled',
    };

    return displayMap[status] || status;
  }

  private getUrgencyDisplay(urgency: UrgencyLevel): string {
    const displayMap = {
      'ROUTINE': 'Routine',
      'URGENT': 'Urgent',
      'STAT': 'STAT',
      'CRITICAL': 'Critical',
    };

    return displayMap[urgency] || urgency;
  }

  private getContrastTypeDisplay(contrastType: ContrastType): string {
    const displayMap = {
      'NONE': 'No Contrast',
      'IV_CONTRAST': 'IV Contrast',
      'ORAL_CONTRAST': 'Oral Contrast',
      'RECTAL_CONTRAST': 'Rectal Contrast',
      'INTRA_ARTICULAR': 'Intra-articular',
      'OTHER': 'Other',
    };

    return displayMap[contrastType] || contrastType;
  }

  private estimateRadiationDose(modality: ImagingModality): number {
    const doseMap = {
      'XRAY': 0.1,
      'CT': 7.0,
      'MRI': 0,
      'ULTRASOUND': 0,
      'PET': 25.0,
      'PET_CT': 32.0,
      'SPECT': 10.0,
      'SPECT_CT': 17.0,
      'MAMMOGRAPHY': 0.4,
      'INTERVENTIONAL': 15.0,
      'NUCLEAR_MEDICINE': 12.0,
      'FLUOROSCOPY': 5.0,
      'ANGIOGRAPHY': 20.0,
      'OTHER': 1.0,
    };

    return doseMap[modality] || 0;
  }

  private getAnnualDoseLimit(): number {
    return 50; // mSv per year for occupational exposure
  }

  private getRadiationRiskLevel(totalDose: number): string {
    if (totalDose < 1) return 'Negligible';
    if (totalDose < 10) return 'Low';
    if (totalDose < 20) return 'Moderate';
    if (totalDose < 50) return 'High';
    return 'Very High';
  }

  private async getOrdersByModalityStatistics(where: any): Promise<any> {
    const orders = await this.prisma.radiologyOrder.findMany({
      where,
      select: {
        modality: true,
      },
    });

    const modalityStats = orders.reduce((acc, order) => {
      const modality = this.getModalityDisplay(order.modality);
      acc[modality] = (acc[modality] || 0) + 1;
      return acc;
    }, {});

    return modalityStats;
  }

  private async getOrdersByMonthStatistics(where: any): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const orders = await this.prisma.radiologyOrder.findMany({
      where: {
        ...where,
        requestedDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        requestedDate: true,
      },
    });

    const monthlyStats = Array.from({ length: 12 }, (_, i) => 0);

    orders.forEach(order => {
      const month = order.requestedDate.getMonth();
      monthlyStats[month]++;
    });

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return monthNames.map((month, index) => ({
      month,
      count: monthlyStats[index],
    }));
  }
}