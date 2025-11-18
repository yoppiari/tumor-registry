"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VitalSignsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalSignsService = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("@/database/prisma/service");
let VitalSignsService = VitalSignsService_1 = class VitalSignsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(VitalSignsService_1.name);
        this.normalRanges = {
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
        this.criticalThresholds = {
            temperature: { min: 35.0, max: 39.0 },
            systolic: { min: 70, max: 180 },
            diastolic: { min: 40, max: 110 },
            heartRate: { min: 40, max: 150 },
            respiratoryRate: { min: 8, max: 30 },
            oxygenSaturation: { min: 88, max: 100 },
            bloodGlucose: { min: 40, max: 400 },
        };
    }
    async recordVitalSign(vitalSignData) {
        try {
            let bmi;
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
            const alerts = this.checkVitalSignAlerts(vitalSign);
            if (alerts.length > 0) {
                this.handleVitalSignAlerts(alerts, vitalSign);
            }
            this.logger.log(`Vital signs recorded for patient ${vitalSign.patient.name}`);
            return vitalSign;
        }
        catch (error) {
            this.logger.error('Error recording vital signs', error);
            throw error;
        }
    }
    async getVitalSignsByPatient(patientId, limit = 10, offset = 0, dateFrom, dateTo) {
        try {
            const where = {
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
                patientAge: vitalSign.patient.dateOfBirth ? this.calculateAge(vitalSign.patient.dateOfBirth) : null,
                isWithinNormalRange: this.isWithinNormalRange(vitalSign),
            }));
        }
        catch (error) {
            this.logger.error(`Error getting vital signs for patient: ${patientId}`, error);
            throw error;
        }
    }
    async getLatestVitalSign(patientId) {
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
        }
        catch (error) {
            this.logger.error(`Error getting latest vital sign for patient: ${patientId}`, error);
            throw error;
        }
    }
    async getVitalSignTrends(patientId, parameter, days = 30) {
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
        }
        catch (error) {
            this.logger.error(`Error getting vital sign trends for patient: ${patientId}`, error);
            throw error;
        }
    }
    async getVitalSignStatistics(centerId, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const where = {
                recordedAt: {
                    gte: startDate,
                },
            };
            if (centerId) {
                where.patient = {
                    centerId,
                };
            }
            const [totalMeasurements, criticalMeasurements, warningMeasurements, averageVitals, abnormalReadings,] = await Promise.all([
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
        }
        catch (error) {
            this.logger.error('Error getting vital sign statistics', error);
            throw error;
        }
    }
    async getPatientsNeedingAttention(centerId) {
        try {
            const recentAlerts = [];
            const where = {
                recordedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
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
                take: 100,
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
            const uniqueAlerts = recentAlerts.filter((alert, index, self) => index === self.findIndex(a => a.patientId === alert.patientId));
            return uniqueAlerts.sort((a, b) => {
                const aCritical = a.alerts.some(alert => alert.type === 'CRITICAL');
                const bCritical = b.alerts.some(alert => alert.type === 'CRITICAL');
                if (aCritical !== bCritical) {
                    return bCritical ? 1 : -1;
                }
                return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
            });
        }
        catch (error) {
            this.logger.error('Error getting patients needing attention', error);
            throw error;
        }
    }
    async getVitalSignAlertsForPatient(patientId, hours = 24) {
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
        }
        catch (error) {
            this.logger.error(`Error getting vital sign alerts for patient: ${patientId}`, error);
            throw error;
        }
    }
    checkVitalSignAlerts(vitalSign) {
        const alerts = [];
        const timestamp = vitalSign.recordedAt;
        if (vitalSign.temperature !== null) {
            const tempAlert = this.checkParameterAlert('temperature', vitalSign.temperature, this.criticalThresholds.temperature, this.normalRanges.temperature, timestamp, vitalSign.patientId);
            if (tempAlert)
                alerts.push(tempAlert);
        }
        if (vitalSign.bloodPressureSystolic !== null && vitalSign.bloodPressureDiastolic !== null) {
            const systolicAlert = this.checkParameterAlert('bloodPressureSystolic', vitalSign.bloodPressureSystolic, this.criticalThresholds.systolic, this.normalRanges.systolic, timestamp, vitalSign.patientId);
            if (systolicAlert)
                alerts.push(systolicAlert);
            const diastolicAlert = this.checkParameterAlert('bloodPressureDiastolic', vitalSign.bloodPressureDiastolic, this.criticalThresholds.diastolic, this.normalRanges.diastolic, timestamp, vitalSign.patientId);
            if (diastolicAlert)
                alerts.push(diastolicAlert);
        }
        if (vitalSign.heartRate !== null) {
            const hrAlert = this.checkParameterAlert('heartRate', vitalSign.heartRate, this.criticalThresholds.heartRate, this.normalRanges.heartRate, timestamp, vitalSign.patientId);
            if (hrAlert)
                alerts.push(hrAlert);
        }
        if (vitalSign.respiratoryRate !== null) {
            const rrAlert = this.checkParameterAlert('respiratoryRate', vitalSign.respiratoryRate, this.criticalThresholds.respiratoryRate, this.normalRanges.respiratoryRate, timestamp, vitalSign.patientId);
            if (rrAlert)
                alerts.push(rrAlert);
        }
        if (vitalSign.oxygenSaturation !== null) {
            const o2Alert = this.checkParameterAlert('oxygenSaturation', vitalSign.oxygenSaturation, this.criticalThresholds.oxygenSaturation, this.normalRanges.oxygenSaturation, timestamp, vitalSign.patientId);
            if (o2Alert)
                alerts.push(o2Alert);
        }
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
        if (vitalSign.bloodGlucose !== null) {
            const bgAlert = this.checkParameterAlert('bloodGlucose', vitalSign.bloodGlucose, this.criticalThresholds.bloodGlucose, this.normalRanges.bloodGlucose.random, timestamp, vitalSign.patientId);
            if (bgAlert)
                alerts.push(bgAlert);
        }
        return alerts;
    }
    checkParameterAlert(parameter, value, criticalRange, normalRange, timestamp, patientId) {
        let type;
        let range;
        if (value < criticalRange.min || value > criticalRange.max) {
            type = 'CRITICAL';
            range = criticalRange;
        }
        else if (value < normalRange.min || value > normalRange.max) {
            type = 'WARNING';
            range = normalRange;
        }
        else {
            return null;
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
    handleVitalSignAlerts(alerts, vitalSign) {
        const criticalAlerts = alerts.filter(alert => alert.type === 'CRITICAL');
        const warningAlerts = alerts.filter(alert => alert.type === 'WARNING');
        if (criticalAlerts.length > 0) {
            this.logger.error(`CRITICAL VITAL SIGN ALERT - Patient ${vitalSign.patientId}: ` +
                criticalAlerts.map(alert => `${alert.parameter}=${alert.value}${alert.normalRange.unit}`).join(', '));
        }
        if (warningAlerts.length > 0) {
            this.logger.warn(`VITAL SIGN WARNING - Patient ${vitalSign.patientId}: ` +
                warningAlerts.map(alert => `${alert.parameter}=${alert.value}${alert.normalRange.unit}`).join(', '));
        }
    }
    isWithinNormalRange(vitalSign) {
        const checks = [];
        if (vitalSign.temperature !== null) {
            checks.push(vitalSign.temperature >= this.normalRanges.temperature.min &&
                vitalSign.temperature <= this.normalRanges.temperature.max);
        }
        if (vitalSign.bloodPressureSystolic !== null && vitalSign.bloodPressureDiastolic !== null) {
            checks.push(vitalSign.bloodPressureSystolic >= this.normalRanges.systolic.min &&
                vitalSign.bloodPressureSystolic <= this.normalRanges.systolic.max &&
                vitalSign.bloodPressureDiastolic >= this.normalRanges.diastolic.min &&
                vitalSign.bloodPressureDiastolic <= this.normalRanges.diastolic.max);
        }
        if (vitalSign.heartRate !== null) {
            checks.push(vitalSign.heartRate >= this.normalRanges.heartRate.min &&
                vitalSign.heartRate <= this.normalRanges.heartRate.max);
        }
        if (vitalSign.respiratoryRate !== null) {
            checks.push(vitalSign.respiratoryRate >= this.normalRanges.respiratoryRate.min &&
                vitalSign.respiratoryRate <= this.normalRanges.respiratoryRate.max);
        }
        if (vitalSign.oxygenSaturation !== null) {
            checks.push(vitalSign.oxygenSaturation >= this.normalRanges.oxygenSaturation.min &&
                vitalSign.oxygenSaturation <= this.normalRanges.oxygenSaturation.max);
        }
        return checks.every(check => check);
    }
    calculatePatientAge(dateOfBirth) {
        const today = new Date();
        let age = today.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        return age;
    }
    async getCriticalMeasurementsCount(where) {
        const recentVitalSigns = await this.prisma.vitalSign.findMany({
            where,
            take: 1000,
            orderBy: { recordedAt: 'desc' },
            select: {
                temperature: true,
                bloodPressureSystolic: true,
                bloodPressureDiastolic: true,
                heartRate: true,
                respiratoryRate: true,
                oxygenSaturation: true,
            },
        });
        return recentVitalSigns.reduce((count, vs) => {
            const alerts = this.checkVitalSignAlerts(vs);
            return alerts.some(alert => alert.type === 'CRITICAL') ? count + 1 : count;
        }, 0);
    }
    async getWarningMeasurementsCount(where) {
        const recentVitalSigns = await this.prisma.vitalSign.findMany({
            where,
            take: 1000,
            orderBy: { recordedAt: 'desc' },
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
            const alerts = this.checkVitalSignAlerts(vs);
            return alerts.some(alert => alert.type === 'WARNING') ? count + 1 : count;
        }, 0);
    }
    async getAverageVitals(where) {
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
        if (vitalSigns.length === 0)
            return {};
        const avg = (arr) => arr.filter(val => val !== null).reduce((sum, val, _, arr) => sum + val, 0) / arr.filter(val => val !== null).length;
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
    async getAbnormalReadingsCount(where) {
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
};
exports.VitalSignsService = VitalSignsService;
exports.VitalSignsService = VitalSignsService = VitalSignsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof service_1.PrismaService !== "undefined" && service_1.PrismaService) === "function" ? _a : Object])
], VitalSignsService);
//# sourceMappingURL=vital-signs.service.js.map