import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { VitalSign } from '@prisma/client';

interface VitalSignAlert {
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  parameter: string;
  value: number;
  normalRange: {
    min: number;
    max: number;
    unit: string;
  };
  timestamp: Date;
  patientId: string;
}

@Injectable()
export class VitalSignsService {
  private readonly logger = new Logger(VitalSignsService.name);

  // Vital sign normal ranges for adults
  private readonly normalRanges = {
    temperature: { min: 36.1, max: 37.2, unit: '°C' },
    systolic: { min: 90, max: 120, unit: 'mmHg' },
    diastolic: { min: 60, max: 80, unit: 'mmHg' },
    heartRate: { min: 60, max: 100, unit: 'bpm' },
    respiratoryRate: { min: 12, max: 20, unit: 'breaths/min' },
    oxygenSaturation: { min: 95, max: 100, unit: '%' },
    bloodGlucose: {
      fasting: { min: 70, max: 99, unit: 'mg/dL' },
      random: { min: 70, max: 140, unit: 'mg/dL' },
    },
    painScale: { min: 0, max: 10, unit: 'scale' },
  };

  private readonly criticalThresholds = {
    temperature: { min: 35.0, max: 39.0, unit: '°C' },
    systolic: { min: 70, max: 180, unit: 'mmHg' },
    diastolic: { min: 40, max: 110, unit: 'mmHg' },
    heartRate: { min: 40, max: 150, unit: 'bpm' },
    respiratoryRate: { min: 8, max: 30, unit: 'breaths/min' },
    oxygenSaturation: { min: 88, max: 100, unit: '%' },
    bloodGlucose: { min: 40, max: 400, unit: 'mg/dL' },
  };

  constructor(private prisma: PrismaService) {}

  async recordVitalSign(vitalSignData: {
    patientId: string;
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    height?: number;
    weight?: number;
    painScale?: number;
    bloodGlucose?: number;
    notes?: string;
    recordedBy: string;
  }): Promise<VitalSign> {
    try {
      // Calculate BMI if height and weight are provided
      let bmi: number | undefined;
      if (vitalSignData.height && vitalSignData.weight) {
        bmi = vitalSignData.weight / Math.pow(vitalSignData.height / 100, 2);
      }

      const vitalSign = await this.prisma.vitalSign.create({
        data: {
          patientId: vitalSignData.patientId,
          temperature: vitalSignData.temperature,
          bloodPressureSystolic: vitalSignData.bloodPressureSystolic,
          bloodPressureDiastolic: vitalSignData.bloodPressureDiastolic,
          heartRate: vitalSignData.heartRate,
          respiratoryRate: vitalSignData.respiratoryRate,
          oxygenSaturation: vitalSignData.oxygenSaturation,
          height: vitalSignData.height,
          weight: vitalSignData.weight,
          bmi: bmi,
          painScale: vitalSignData.painScale,
          bloodGlucose: vitalSignData.bloodGlucose,
          notes: vitalSignData.notes,
          recordedBy: vitalSignData.recordedBy,
          recordedAt: new Date(),
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

      // Check for alerts
      const alerts = this.checkVitalSignAlerts(vitalSign);
      if (alerts.length > 0) {
        this.handleVitalSignAlerts(alerts, vitalSign);
      }

      this.logger.log(`Vital signs recorded for patient ${vitalSign.patient.name}`);
      return vitalSign;
    } catch (error) {
      this.logger.error('Error recording vital signs', error);
      throw error;
    }
  }

  async getVitalSignsByPatient(
    patientId: string,
    limit = 10,
    offset = 0,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<any[]> {
    try {
      const where: any = {
        patientId,
      };

      if (dateFrom || dateTo) {
        where.recordedAt = {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        };
      }

      const vitalSigns = await this.prisma.vitalSign.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
              dateOfBirth: true,
            },
          },
        },
        orderBy: [
          { recordedAt: 'desc' },
        ],
        skip: offset,
        take: limit,
      });

      return vitalSigns.map(vitalSign => ({
        ...vitalSign,
        alerts: this.checkVitalSignAlerts(vitalSign),
        patientAge: vitalSign.patient.dateOfBirth ? this.calculatePatientAge(vitalSign.patient.dateOfBirth) : null,
        isWithinNormalRange: this.isWithinNormalRange(vitalSign),
      }));
    } catch (error) {
      this.logger.error(`Error getting vital signs for patient: ${patientId}`, error);
      throw error;
    }
  }

  async getLatestVitalSign(patientId: string): Promise<VitalSign | null> {
    try {
      return await this.prisma.vitalSign.findFirst({
        where: {
          patientId,
        },
        orderBy: {
          recordedAt: 'desc',
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
    } catch (error) {
      this.logger.error(`Error getting latest vital sign for patient: ${patientId}`, error);
      throw error;
    }
  }

  async getVitalSignTrends(
    patientId: string,
    parameter: string,
    days = 30
  ): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const vitalSigns = await this.prisma.vitalSign.findMany({
        where: {
          patientId,
          recordedAt: {
            gte: startDate,
          },
        },
        orderBy: {
          recordedAt: 'asc',
        },
        select: {
          recordedAt: true,
          [parameter]: true,
        },
      });

      return vitalSigns.map(vs => ({
        timestamp: vs.recordedAt,
        value: vs[parameter],
      }));
    } catch (error) {
      this.logger.error(`Error getting vital sign trends for patient: ${patientId}`, error);
      throw error;
    }
  }

  async getVitalSignStatistics(centerId?: string, days = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const where: any = {
        recordedAt: {
          gte: startDate,
        },
      };

      if (centerId) {
        where.patient = {
          centerId,
        };
      }

      const [
        totalMeasurements,
        criticalMeasurements,
        warningMeasurements,
        averageVitals,
        abnormalReadings,
      ] = await Promise.all([
        this.prisma.vitalSign.count({ where }),
        this.getCriticalMeasurementsCount(where),
        this.getWarningMeasurementsCount(where),
        this.getAverageVitals(where),
        this.getAbnormalReadingsCount(where),
      ]);

      return {
        totalMeasurements,
        criticalMeasurements,
        warningMeasurements,
        averageVitals,
        abnormalReadings,
      };
    } catch (error) {
      this.logger.error('Error getting vital sign statistics', error);
      throw error;
    }
  }

  async getPatientsNeedingAttention(centerId?: string): Promise<any[]> {
    try {
      const recentAlerts = [];

      // Get recent vital signs with critical or warning values
      const where: any = {
        recordedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      };

      if (centerId) {
        where.patient = {
          centerId,
        };
      }

      const vitalSigns = await this.prisma.vitalSign.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              medicalRecordNumber: true,
            },
          },
        },
        orderBy: {
          recordedAt: 'desc',
        },
        take: 100, // Limit to prevent too many results
      });

      for (const vitalSign of vitalSigns) {
        const alerts = this.checkVitalSignAlerts(vitalSign);
        if (alerts.length > 0) {
          recentAlerts.push({
            patientId: vitalSign.patientId,
            patientName: vitalSign.patient.name,
            patientMRN: vitalSign.patient.medicalRecordNumber,
            vitalSignId: vitalSign.id,
            recordedAt: vitalSign.recordedAt,
            alerts,
            recordedBy: vitalSign.recordedBy,
          });
        }
      }

      // Remove duplicates (multiple alerts for same patient)
      const uniqueAlerts = recentAlerts.filter((alert, index, self) =>
        index === self.findIndex(a => a.patientId === alert.patientId)
      );

      return uniqueAlerts.sort((a, b) => {
        // Sort by most critical alert first, then by most recent
        const aCritical = a.alerts.some(alert => alert.type === 'CRITICAL');
        const bCritical = b.alerts.some(alert => alert.type === 'CRITICAL');

        if (aCritical !== bCritical) {
          return bCritical ? 1 : -1;
        }

        return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
      });
    } catch (error) {
      this.logger.error('Error getting patients needing attention', error);
      throw error;
    }
  }

  async getVitalSignAlertsForPatient(
    patientId: string,
    hours = 24
  ): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() - hours);

      const vitalSigns = await this.prisma.vitalSign.findMany({
        where: {
          patientId,
          recordedAt: {
            gte: startDate,
          },
        },
        orderBy: {
          recordedAt: 'desc',
        },
        include: {
          patient: {
            select: {
              name: true,
              medicalRecordNumber: true,
            },
          },
        },
        take: 50,
      });

      const allAlerts = [];
      for (const vitalSign of vitalSigns) {
        const alerts = this.checkVitalSignAlerts(vitalSign);
        if (alerts.length > 0) {
          allAlerts.push({
            vitalSignId: vitalSign.id,
            recordedAt: vitalSign.recordedAt,
            alerts,
            vitalSign: {
              patientName: vitalSign.patient.name,
              patientMRN: vitalSign.patient.medicalRecordNumber,
            },
          });
        }
      }

      return allAlerts;
    } catch (error) {
      this.logger.error(`Error getting vital sign alerts for patient: ${patientId}`, error);
      throw error;
    }
  }

  private checkVitalSignAlerts(vitalSign: Pick<VitalSign, 'recordedAt' | 'patientId' | 'temperature' | 'bloodPressureSystolic' | 'bloodPressureDiastolic' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation' | 'painScale' | 'bloodGlucose'>): VitalSignAlert[] {
    const alerts: VitalSignAlert[] = [];
    const timestamp = vitalSign.recordedAt;

    // Check temperature
    if (vitalSign.temperature !== null) {
      const tempAlert = this.checkParameterAlert(
        'temperature',
        vitalSign.temperature,
        this.criticalThresholds.temperature,
        this.normalRanges.temperature,
        timestamp,
        vitalSign.patientId
      );
      if (tempAlert) alerts.push(tempAlert);
    }

    // Check blood pressure
    if (vitalSign.bloodPressureSystolic !== null && vitalSign.bloodPressureDiastolic !== null) {
      const systolicAlert = this.checkParameterAlert(
        'bloodPressureSystolic',
        vitalSign.bloodPressureSystolic,
        this.criticalThresholds.systolic,
        this.normalRanges.systolic,
        timestamp,
        vitalSign.patientId
      );
      if (systolicAlert) alerts.push(systolicAlert);

      const diastolicAlert = this.checkParameterAlert(
        'bloodPressureDiastolic',
        vitalSign.bloodPressureDiastolic,
        this.criticalThresholds.diastolic,
        this.normalRanges.diastolic,
        timestamp,
        vitalSign.patientId
      );
      if (diastolicAlert) alerts.push(diastolicAlert);
    }

    // Check heart rate
    if (vitalSign.heartRate !== null) {
      const hrAlert = this.checkParameterAlert(
        'heartRate',
        vitalSign.heartRate,
        this.criticalThresholds.heartRate,
        this.normalRanges.heartRate,
        timestamp,
        vitalSign.patientId
      );
      if (hrAlert) alerts.push(hrAlert);
    }

    // Check respiratory rate
    if (vitalSign.respiratoryRate !== null) {
      const rrAlert = this.checkParameterAlert(
        'respiratoryRate',
        vitalSign.respiratoryRate,
        this.criticalThresholds.respiratoryRate,
        this.normalRanges.respiratoryRate,
        timestamp,
        vitalSign.patientId
      );
      if (rrAlert) alerts.push(rrAlert);
    }

    // Check oxygen saturation
    if (vitalSign.oxygenSaturation !== null) {
      const o2Alert = this.checkParameterAlert(
        'oxygenSaturation',
        vitalSign.oxygenSaturation,
        this.criticalThresholds.oxygenSaturation,
        this.normalRanges.oxygenSaturation,
        timestamp,
        vitalSign.patientId
      );
      if (o2Alert) alerts.push(o2Alert);
    }

    // Check pain scale
    if (vitalSign.painScale !== null && vitalSign.painScale >= 8) {
      alerts.push({
        type: 'WARNING',
        parameter: 'painScale',
        value: vitalSign.painScale,
        normalRange: this.normalRanges.painScale,
        timestamp,
        patientId: vitalSign.patientId,
      });
    }

    // Check blood glucose
    if (vitalSign.bloodGlucose !== null) {
      const bgAlert = this.checkParameterAlert(
        'bloodGlucose',
        vitalSign.bloodGlucose,
        this.criticalThresholds.bloodGlucose,
        this.normalRanges.bloodGlucose.random,
        timestamp,
        vitalSign.patientId
      );
      if (bgAlert) alerts.push(bgAlert);
    }

    return alerts;
  }

  private checkParameterAlert(
    parameter: string,
    value: number,
    criticalRange: { min: number; max: number; unit: string },
    normalRange: { min: number; max: number; unit: string },
    timestamp: Date,
    patientId: string
  ): VitalSignAlert | null {
    let type: 'CRITICAL' | 'WARNING' | 'INFO';
    let range: { min: number; max: number; unit: string };

    // Determine alert level and range
    if (value < criticalRange.min || value > criticalRange.max) {
      type = 'CRITICAL';
      range = criticalRange;
    } else if (value < normalRange.min || value > normalRange.max) {
      type = 'WARNING';
      range = normalRange;
    } else {
      return null; // Normal range, no alert
    }

    return {
      type,
      parameter,
      value,
      normalRange: range,
      timestamp,
      patientId,
    };
  }

  private handleVitalSignAlerts(alerts: VitalSignAlert[], vitalSign: VitalSign): void {
    const criticalAlerts = alerts.filter(alert => alert.type === 'CRITICAL');
    const warningAlerts = alerts.filter(alert => alert.type === 'WARNING');

    if (criticalAlerts.length > 0) {
      this.logger.error(
        `CRITICAL VITAL SIGN ALERT - Patient ${vitalSign.patientId}: ` +
        criticalAlerts.map(alert => `${alert.parameter}=${alert.value}${alert.normalRange.unit}`).join(', ')
      );
      // In a real implementation, this would trigger:
      // - Immediate notification to clinical staff
      // - Integration with emergency response system
      // - Patient monitoring dashboard alerts
    }

    if (warningAlerts.length > 0) {
      this.logger.warn(
        `VITAL SIGN WARNING - Patient ${vitalSign.patientId}: ` +
        warningAlerts.map(alert => `${alert.parameter}=${alert.value}${alert.normalRange.unit}`).join(', ')
      );
      // In a real implementation, this would trigger:
      // - Notification to nursing staff
      // - Patient monitoring dashboard warnings
      // - Follow-up scheduling
    }
  }

  private isWithinNormalRange(vitalSign: Pick<VitalSign, 'temperature' | 'bloodPressureSystolic' | 'bloodPressureDiastolic' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation'>): boolean {
    const checks = [];

    if (vitalSign.temperature !== null) {
      checks.push(
        vitalSign.temperature >= this.normalRanges.temperature.min &&
        vitalSign.temperature <= this.normalRanges.temperature.max
      );
    }

    if (vitalSign.bloodPressureSystolic !== null && vitalSign.bloodPressureDiastolic !== null) {
      checks.push(
        vitalSign.bloodPressureSystolic >= this.normalRanges.systolic.min &&
        vitalSign.bloodPressureSystolic <= this.normalRanges.systolic.max &&
        vitalSign.bloodPressureDiastolic >= this.normalRanges.diastolic.min &&
        vitalSign.bloodPressureDiastolic <= this.normalRanges.diastolic.max
      );
    }

    if (vitalSign.heartRate !== null) {
      checks.push(
        vitalSign.heartRate >= this.normalRanges.heartRate.min &&
        vitalSign.heartRate <= this.normalRanges.heartRate.max
      );
    }

    if (vitalSign.respiratoryRate !== null) {
      checks.push(
        vitalSign.respiratoryRate >= this.normalRanges.respiratoryRate.min &&
        vitalSign.respiratoryRate <= this.normalRanges.respiratoryRate.max
      );
    }

    if (vitalSign.oxygenSaturation !== null) {
      checks.push(
        vitalSign.oxygenSaturation >= this.normalRanges.oxygenSaturation.min &&
        vitalSign.oxygenSaturation <= this.normalRanges.oxygenSaturation.max
      );
    }

    return checks.every(check => check);
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

  private async getCriticalMeasurementsCount(where: any): Promise<number> {
    // This would ideally use database queries for performance
    // For now, we'll approximate by checking recent records
    const recentVitalSigns = await this.prisma.vitalSign.findMany({
      where,
      take: 1000, // Limit for performance
      orderBy: { recordedAt: 'desc' },
      select: {
        patientId: true,
        recordedAt: true,
        temperature: true,
        bloodPressureSystolic: true,
        bloodPressureDiastolic: true,
        heartRate: true,
        respiratoryRate: true,
        oxygenSaturation: true,
        painScale: true,
        bloodGlucose: true,
      },
    });

    return recentVitalSigns.reduce((count, vs) => {
      const alerts = this.checkVitalSignAlerts(vs);
      return alerts.some(alert => alert.type === 'CRITICAL') ? count + 1 : count;
    }, 0);
  }

  private async getWarningMeasurementsCount(where: any): Promise<number> {
    const recentVitalSigns = await this.prisma.vitalSign.findMany({
      where,
      take: 1000,
      orderBy: { recordedAt: 'desc' },
      select: {
        patientId: true,
        recordedAt: true,
        temperature: true,
        bloodPressureSystolic: true,
        bloodPressureDiastolic: true,
        heartRate: true,
        respiratoryRate: true,
        oxygenSaturation: true,
        painScale: true,
        bloodGlucose: true,
      },
    });

    return recentVitalSigns.reduce((count, vs) => {
      const alerts = this.checkVitalSignAlerts(vs);
      return alerts.some(alert => alert.type === 'WARNING') ? count + 1 : count;
    }, 0);
  }

  private async getAverageVitals(where: any): Promise<any> {
    const vitalSigns = await this.prisma.vitalSign.findMany({
      where,
      take: 1000,
      select: {
        temperature: true,
        bloodPressureSystolic: true,
        bloodPressureDiastolic: true,
        heartRate: true,
        respiratoryRate: true,
        oxygenSaturation: true,
        weight: true,
        height: true,
        painScale: true,
        bloodGlucose: true,
      },
    });

    if (vitalSigns.length === 0) return {};

    const avg = (arr: (number | null)[]) =>
      arr.filter(val => val !== null).reduce((sum, val, _, arr) => sum + val, 0) / arr.filter(val => val !== null).length;

    return {
      temperature: avg(vitalSigns.map(vs => vs.temperature)),
      systolic: avg(vitalSigns.map(vs => vs.bloodPressureSystolic)),
      diastolic: avg(vitalSigns.map(vs => vs.bloodPressureDiastolic)),
      heartRate: avg(vitalSigns.map(vs => vs.heartRate)),
      respiratoryRate: avg(vitalSigns.map(vs => vs.respiratoryRate)),
      oxygenSaturation: avg(vitalSigns.map(vs => vs.oxygenSaturation)),
      weight: avg(vitalSigns.map(vs => vs.weight)),
      height: avg(vitalSigns.map(vs => vs.height)),
      painScale: avg(vitalSigns.map(vs => vs.painScale)),
      bloodGlucose: avg(vitalSigns.map(vs => vs.bloodGlucose)),
    };
  }

  private async getAbnormalReadingsCount(where: any): Promise<number> {
    const recentVitalSigns = await this.prisma.vitalSign.findMany({
      where,
      take: 1000,
      select: {
        temperature: true,
        bloodPressureSystolic: true,
        bloodPressureDiastolic: true,
        heartRate: true,
        respiratoryRate: true,
        oxygenSaturation: true,
        painScale: true,
        bloodGlucose: true,
      },
    });

    return recentVitalSigns.reduce((count, vs) => {
      return !this.isWithinNormalRange(vs) ? count + 1 : count;
    }, 0);
  }
}