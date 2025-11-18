import { PrismaService } from '@/database/prisma/service';
import { VitalSign } from '@prisma/client';
export declare class VitalSignsService {
    private prisma;
    private readonly logger;
    private readonly normalRanges;
    private readonly criticalThresholds;
    constructor(prisma: PrismaService);
    recordVitalSign(vitalSignData: {
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
    }): Promise<VitalSign>;
    getVitalSignsByPatient(patientId: string, limit?: number, offset?: number, dateFrom?: Date, dateTo?: Date): Promise<any[]>;
    getLatestVitalSign(patientId: string): Promise<VitalSign | null>;
    getVitalSignTrends(patientId: string, parameter: string, days?: number): Promise<any[]>;
    getVitalSignStatistics(centerId?: string, days?: number): Promise<any>;
    getPatientsNeedingAttention(centerId?: string): Promise<any[]>;
    getVitalSignAlertsForPatient(patientId: string, hours?: number): Promise<any[]>;
    private checkVitalSignAlerts;
    private checkParameterAlert;
    private handleVitalSignAlerts;
    private isWithinNormalRange;
    private calculatePatientAge;
    private getCriticalMeasurementsCount;
    private getWarningMeasurementsCount;
    private getAverageVitals;
    private getAbnormalReadingsCount;
}
