import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { LabTestType, LabTestStatus, SpecimenType, UrgencyLevel } from '@prisma/client';

@Injectable()
export class LaboratoryService {
  private readonly logger = new Logger(LaboratoryService.name);

  constructor(private prisma: PrismaService) {}

  async createLabOrder(orderData: {
    patientId: string;
    orderingPhysicianId: string;
    testType: LabTestType;
    specimenType: SpecimenType;
    urgency: UrgencyLevel;
    clinicalIndication?: string;
    requestedDate: Date;
    notes?: string;
  }) {
    try {
      const order = await this.prisma.labTestOrder.create({
        data: {
          patientId: orderData.patientId,
          orderingPhysicianId: orderData.orderingPhysicianId,
          testType: orderData.testType,
          specimenType: orderData.specimenType,
          urgency: orderData.urgency,
          clinicalIndication: orderData.clinicalIndication,
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

      this.logger.log(`Lab order created: ${order.testType} for patient ${order.patient.name}`);
      return order;
    } catch (error) {
      this.logger.error('Error creating lab order', error);
      throw error;
    }
  }

  async updateLabResult(orderId: string, resultData: {
    result?: string;
    numericalResult?: number;
    unit?: string;
    referenceRange?: string;
    interpretation?: string;
    flaggedAsAbnormal?: boolean;
    performedBy?: string;
    performedAt?: Date;
    verifiedBy?: string;
    verifiedAt?: Date;
    notes?: string;
  }) {
    try {
      const order = await this.prisma.labTestOrder.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException(`Lab order with ID ${orderId} not found`);
      }

      const updatedOrder = await this.prisma.labTestOrder.update({
        where: { id: orderId },
        data: {
          ...(resultData.result !== undefined && { result: resultData.result }),
          ...(resultData.numericalResult !== undefined && { numericalResult: resultData.numericalResult }),
          ...(resultData.unit !== undefined && { unit: resultData.unit }),
          ...(resultData.referenceRange !== undefined && { referenceRange: resultData.referenceRange }),
          ...(resultData.interpretation !== undefined && { interpretation: resultData.interpretation }),
          ...(resultData.flaggedAsAbnormal !== undefined && { flaggedAsAbnormal: resultData.flaggedAsAbnormal }),
          ...(resultData.performedBy !== undefined && { performedBy: resultData.performedBy }),
          ...(resultData.performedAt !== undefined && { performedAt: resultData.performedAt }),
          ...(resultData.verifiedBy !== undefined && { verifiedBy: resultData.verifiedBy }),
          ...(resultData.verifiedAt !== undefined && { verifiedAt: resultData.verifiedAt }),
          ...(resultData.notes !== undefined && { notes: resultData.notes }),
          status: resultData.verifiedBy ? 'VERIFIED' : 'COMPLETED',
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
            },
          },
        },
      });

      this.logger.log(`Lab result updated for order: ${orderId}`);

      // Create alert if result is abnormal
      if (updatedOrder.flaggedAsAbnormal) {
        await this.createAbnormalResultAlert(updatedOrder);
      }

      return updatedOrder;
    } catch (error) {
      this.logger.error(`Error updating lab result for order: ${orderId}`, error);
      throw error;
    }
  }

  async getLabOrdersByPatient(patientId: string, options: {
    testType?: LabTestType;
    status?: LabTestStatus;
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

      if (options.testType) {
        where.testType = options.testType;
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
        this.prisma.labTestOrder.findMany({
          where,
          include: {
            orderingPhysician: {
              select: {
                id: true,
                name: true,
              },
            },
            performedByUser: {
              select: {
                id: true,
                name: true,
              },
            },
            verifiedByUser: {
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
        this.prisma.labTestOrder.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        orders: orders.map(order => ({
          ...order,
          testTypeDisplay: this.getTestTypeDisplay(order.testType),
          statusDisplay: this.getStatusDisplay(order.status),
          urgencyDisplay: this.getUrgencyDisplay(order.urgency),
          specimenTypeDisplay: this.getSpecimenTypeDisplay(order.specimenType),
        })),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error(`Error getting lab orders for patient: ${patientId}`, error);
      throw error;
    }
  }

  async getLabOrderById(orderId: string) {
    try {
      const order = await this.prisma.labTestOrder.findUnique({
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
          performedByUser: {
            select: {
              id: true,
              name: true,
            },
          },
          verifiedByUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Lab order with ID ${orderId} not found`);
      }

      return {
        ...order,
        patientAge: this.calculatePatientAge(order.patient.dateOfBirth),
        testTypeDisplay: this.getTestTypeDisplay(order.testType),
        statusDisplay: this.getStatusDisplay(order.status),
        urgencyDisplay: this.getUrgencyDisplay(order.urgency),
        specimenTypeDisplay: this.getSpecimenTypeDisplay(order.specimenType),
      };
    } catch (error) {
      this.logger.error(`Error getting lab order by ID: ${orderId}`, error);
      throw error;
    }
  }

  async getLabStatistics(centerId?: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
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
        collectedOrders,
        completedOrders,
        verifiedOrders,
        cancelledOrders,
        urgentOrders,
        abnormalResults,
        ordersByType,
        ordersByMonth,
      ] = await Promise.all([
        this.prisma.labTestOrder.count({ where }),
        this.prisma.labTestOrder.count({ where: { ...where, status: 'REQUESTED' } }),
        this.prisma.labTestOrder.count({ where: { ...where, status: 'COLLECTED' } }),
        this.prisma.labTestOrder.count({ where: { ...where, status: 'COMPLETED' } }),
        this.prisma.labTestOrder.count({ where: { ...where, status: 'VERIFIED' } }),
        this.prisma.labTestOrder.count({ where: { ...where, status: 'CANCELLED' } }),
        this.prisma.labTestOrder.count({ where: { ...where, urgency: 'URGENT' } }),
        this.prisma.labTestOrder.count({ where: { ...where, flaggedAsAbnormal: true } }),
        this.getOrdersByTypeStatistics(where),
        this.getOrdersByMonthStatistics(where),
      ]);

      return {
        totalOrders,
        requestedOrders,
        collectedOrders,
        completedOrders,
        verifiedOrders,
        cancelledOrders,
        urgentOrders,
        abnormalResults,
        abnormalResultRate: totalOrders > 0 ? (abnormalResults / totalOrders * 100).toFixed(2) : 0,
        ordersByType,
        ordersByMonth,
      };
    } catch (error) {
      this.logger.error('Error getting lab statistics', error);
      throw error;
    }
  }

  async getPendingOrders(centerId?: string): Promise<any[]> {
    try {
      const where: any = {
        status: { in: ['REQUESTED', 'COLLECTED'] },
      };

      if (centerId) {
        where.patient = { centerId };
      }

      const orders = await this.prisma.labTestOrder.findMany({
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
        testTypeDisplay: this.getTestTypeDisplay(order.testType),
        statusDisplay: this.getStatusDisplay(order.status),
        urgencyDisplay: this.getUrgencyDisplay(order.urgency),
        daysSinceRequest: Math.ceil((new Date().getTime() - order.requestedDate.getTime()) / (1000 * 60 * 60 * 24)),
      }));
    } catch (error) {
      this.logger.error('Error getting pending orders', error);
      throw error;
    }
  }

  async updateLabOrderStatus(orderId: string, status: LabTestStatus, updatedBy?: string) {
    try {
      const updateData: any = { status };

      if (status === 'COLLECTED') {
        updateData.collectedAt = new Date();
        updateData.collectedBy = updatedBy;
      } else if (status === 'COMPLETED') {
        updateData.performedAt = new Date();
        updateData.performedBy = updatedBy;
      }

      const updatedOrder = await this.prisma.labTestOrder.update({
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

      this.logger.log(`Lab order status updated: ${orderId} -> ${status}`);
      return updatedOrder;
    } catch (error) {
      this.logger.error(`Error updating lab order status: ${orderId}`, error);
      throw error;
    }
  }

  private async createAbnormalResultAlert(order: any) {
    try {
      await this.prisma.alert.create({
        data: {
          patientId: order.patientId,
          type: 'LAB_RESULT',
          severity: 'WARNING',
          title: `Abnormal Lab Result: ${this.getTestTypeDisplay(order.testType)}`,
          message: `Abnormal result detected for ${order.testType}. Result: ${order.result || order.numericalResult}${order.unit ? ` ${order.unit}` : ''}`,
          referenceId: order.id,
          status: 'ACTIVE',
        },
      });

      this.logger.log(`Abnormal result alert created for order: ${order.id}`);
    } catch (error) {
      this.logger.error('Error creating abnormal result alert', error);
      // Don't throw error to avoid breaking the main workflow
    }
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

  private getTestTypeDisplay(testType: LabTestType): string {
    const displayMap = {
      'COMPLETE_BLOOD_COUNT': 'Complete Blood Count (CBC)',
      'COMPREHENSIVE_METABOLIC_PANEL': 'Comprehensive Metabolic Panel (CMP)',
      'LIVER_FUNCTION_TESTS': 'Liver Function Tests (LFT)',
      'KIDNEY_FUNCTION_TESTS': 'Kidney Function Tests',
      'TISSUE_MARKERS': 'Tumor Markers',
      'COAGULATION_PROFILE': 'Coagulation Profile',
      'URINALYSIS': 'Urinalysis',
      'HEMATOLOGY': 'Hematology',
      'BLOOD_CHEMISTRY': 'Blood Chemistry',
      'SEROLOGY': 'Serology',
      'IMMUNOLOGY': 'Immunology',
      'MICROBIOLOGY': 'Microbiology',
      'PATHOLOGY': 'Pathology',
      'CYTOLOGY': 'Cytology',
      'HISTOPATHOLOGY': 'Histopathology',
      'FLOW_CYTOMETRY': 'Flow Cytometry',
      'MOLECULAR_DIAGNOSTICS': 'Molecular Diagnostics',
      'GENETIC_TESTING': 'Genetic Testing',
      'OTHER': 'Other',
    };

    return displayMap[testType] || testType;
  }

  private getStatusDisplay(status: LabTestStatus): string {
    const displayMap = {
      'REQUESTED': 'Requested',
      'COLLECTED': 'Specimen Collected',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'VERIFIED': 'Verified',
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

  private getSpecimenTypeDisplay(specimenType: SpecimenType): string {
    const displayMap = {
      'BLOOD': 'Blood',
      'URINE': 'Urine',
      'TISSUE': 'Tissue',
      'FLUID': 'Body Fluid',
      'SWAB': 'Swab',
      'SMEAR': 'Smear',
      'BIOPSY': 'Biopsy',
      'ASPIRATE': 'Aspirate',
      'OTHER': 'Other',
    };

    return displayMap[specimenType] || specimenType;
  }

  private async getOrdersByTypeStatistics(where: any): Promise<any> {
    const orders = await this.prisma.labTestOrder.findMany({
      where,
      select: {
        testType: true,
      },
    });

    const typeStats = orders.reduce((acc, order) => {
      const type = this.getTestTypeDisplay(order.testType);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return typeStats;
  }

  private async getOrdersByMonthStatistics(where: any): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const orders = await this.prisma.labTestOrder.findMany({
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