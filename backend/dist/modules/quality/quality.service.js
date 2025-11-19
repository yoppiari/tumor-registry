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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("../patients/entities/patient.entity");
const medical_image_entity_1 = require("../medical-imaging/entities/medical-image.entity");
const quality_metric_entity_1 = require("./entities/quality-metric.entity");
let QualityService = class QualityService {
    constructor(patientRepository, imageRepository, qualityMetricRepository) {
        this.patientRepository = patientRepository;
        this.imageRepository = imageRepository;
        this.qualityMetricRepository = qualityMetricRepository;
    }
    async calculateQualityScore(patientId) {
        const patient = await this.patientRepository.findOne({
            where: { id: patientId },
            relations: ['images', 'treatments', 'followUps']
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        let score = 0;
        const maxScore = 100;
        const recommendations = [];
        const requiredFields = [
            { field: 'name', weight: 8 },
            { field: 'idNumber', weight: 8 },
            { field: 'birthDate', weight: 8 },
            { field: 'gender', weight: 8 },
            { field: 'diagnosisDate', weight: 8 }
        ];
        let requiredScore = 0;
        for (const { field, weight } of requiredFields) {
            if (patient[field]) {
                requiredScore += weight;
            }
            else {
                recommendations.push({
                    type: 'missing_field',
                    priority: 'high',
                    message: `Missing required field: ${field}`,
                    field: field
                });
            }
        }
        score += requiredScore;
        const medicalFields = [
            { field: 'tumorType', weight: 10 },
            { field: 'stage', weight: 8 },
            { field: 'medicalHistory', weight: 7 }
        ];
        let medicalScore = 0;
        for (const { field, weight } of medicalFields) {
            if (patient[field]) {
                medicalScore += weight;
            }
            else {
                recommendations.push({
                    type: 'missing_medical_info',
                    priority: 'medium',
                    message: `Add medical information: ${field}`,
                    field: field
                });
            }
        }
        score += medicalScore;
        if (patient.familyHistory) {
            score += 5;
        }
        else {
            recommendations.push({
                type: 'missing_family_history',
                priority: 'low',
                message: 'Consider adding family history for better risk assessment'
            });
        }
        if (patient.previousTreatments) {
            score += 5;
        }
        else {
            recommendations.push({
                type: 'missing_treatment_history',
                priority: 'medium',
                message: 'Document previous treatments for comprehensive care'
            });
        }
        const imageCount = patient.images?.length || 0;
        if (imageCount >= 3) {
            score += 15;
        }
        else if (imageCount >= 1) {
            score += imageCount * 5;
            recommendations.push({
                type: 'insufficient_imaging',
                priority: 'medium',
                message: `Consider adding more diagnostic images (${3 - imageCount} more recommended)`
            });
        }
        else {
            recommendations.push({
                type: 'missing_imaging',
                priority: 'high',
                message: 'No diagnostic images found. Add relevant medical imaging.'
            });
        }
        if (patient.treatments && patient.treatments.length > 0) {
            const latestTreatment = patient.treatments[patient.treatments.length - 1];
            if (latestTreatment.plan && latestTreatment.startDate) {
                score += 10;
            }
            else {
                score += 5;
                recommendations.push({
                    type: 'incomplete_treatment_plan',
                    priority: 'high',
                    message: 'Complete treatment plan details'
                });
            }
        }
        else {
            recommendations.push({
                type: 'missing_treatment_plan',
                priority: 'high',
                message: 'Create treatment plan for patient care'
            });
        }
        const requiredCompleteness = requiredScore / 40;
        const medicalCompleteness = medicalScore / 25;
        const overallCompleteness = score / maxScore;
        await this.saveQualityMetric(patientId, {
            score: Math.round(score),
            requiredCompleteness,
            medicalCompleteness,
            imageCount,
            recommendations: recommendations.length
        });
        return {
            score: Math.round(score),
            completeness: Math.round(overallCompleteness * 100),
            requiredCompleteness: Math.round(requiredCompleteness * 100),
            medicalCompleteness: Math.round(medicalCompleteness * 100),
            imageCount,
            recommendations,
            lastUpdated: new Date(),
            category: this.getQualityCategory(score)
        };
    }
    async getQualityTrends(patientId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const metrics = await this.qualityMetricRepository.find({
            where: {
                patientId,
                createdAt: { $gte: startDate }
            },
            order: { createdAt: 'ASC' }
        });
        return metrics.map(metric => ({
            date: metric.createdAt,
            score: metric.score,
            completeness: metric.completeness,
            imageCount: metric.imageCount,
            recommendations: metric.recommendations
        }));
    }
    async getCenterQualitySummary(centerId) {
        const patients = await this.patientRepository.find({
            where: { centerId }
        });
        const scores = await Promise.all(patients.map(patient => this.calculateQualityScore(patient.id)));
        const totalPatients = scores.length;
        const averageScore = scores.reduce((sum, score) => sum + score.score, 0) / totalPatients;
        const highQualityCount = scores.filter(score => score.score >= 90).length;
        const mediumQualityCount = scores.filter(score => score.score >= 70 && score.score < 90).length;
        const lowQualityCount = scores.filter(score => score.score < 70).length;
        const allRecommendations = scores.flatMap(score => score.recommendations);
        const recommendationTypes = allRecommendations.reduce((acc, rec) => {
            acc[rec.type] = (acc[rec.type] || 0) + 1;
            return acc;
        }, {});
        const topRecommendations = Object.entries(recommendationTypes)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([type, count]) => ({
            type,
            count,
            percentage: Math.round((count / totalPatients) * 100)
        }));
        return {
            centerId,
            totalPatients,
            averageScore: Math.round(averageScore),
            qualityDistribution: {
                high: highQualityCount,
                medium: mediumQualityCount,
                low: lowQualityCount,
                percentages: {
                    high: Math.round((highQualityCount / totalPatients) * 100),
                    medium: Math.round((mediumQualityCount / totalPatients) * 100),
                    low: Math.round((lowQualityCount / totalPatients) * 100)
                }
            },
            topRecommendations,
            lastUpdated: new Date()
        };
    }
    async getNationalQualityOverview() {
        const latestMetrics = await this.qualityMetricRepository.find({
            order: { createdAt: 'DESC' },
            take: 1000
        });
        if (latestMetrics.length === 0) {
            return {
                totalPatients: 0,
                averageScore: 0,
                qualityDistribution: { high: 0, medium: 0, low: 0 },
                trends: []
            };
        }
        const averageScore = latestMetrics.reduce((sum, metric) => sum + metric.score, 0) / latestMetrics.length;
        const highQualityCount = latestMetrics.filter(metric => metric.score >= 90).length;
        const mediumQualityCount = latestMetrics.filter(metric => metric.score >= 70 && metric.score < 90).length;
        const lowQualityCount = latestMetrics.filter(metric => metric.score < 70).length;
        const weeklyTrends = this.calculateWeeklyTrends(latestMetrics);
        return {
            totalPatients: latestMetrics.length,
            averageScore: Math.round(averageScore),
            qualityDistribution: {
                high: highQualityCount,
                medium: mediumQualityCount,
                low: lowQualityCount,
                percentages: {
                    high: Math.round((highQualityCount / latestMetrics.length) * 100),
                    medium: Math.round((mediumQualityCount / latestMetrics.length) * 100),
                    low: Math.round((lowQualityCount / latestMetrics.length) * 100)
                }
            },
            trends: weeklyTrends,
            lastUpdated: new Date()
        };
    }
    async saveQualityMetric(patientId, data) {
        const metric = this.qualityMetricRepository.create({
            patientId,
            score: data.score,
            completeness: Math.round((data.requiredCompleteness + data.medicalCompleteness) * 50),
            requiredCompleteness: Math.round(data.requiredCompleteness * 100),
            medicalCompleteness: Math.round(data.medicalCompleteness * 100),
            imageCount: data.imageCount,
            recommendations: data.recommendations
        });
        await this.qualityMetricRepository.save(metric);
    }
    getQualityCategory(score) {
        if (score >= 90)
            return 'excellent';
        if (score >= 80)
            return 'good';
        if (score >= 70)
            return 'fair';
        return 'poor';
    }
    calculateWeeklyTrends(metrics) {
        const weeklyData = metrics.reduce((acc, metric) => {
            const week = this.getWeekNumber(metric.createdAt);
            if (!acc[week]) {
                acc[week] = { total: 0, count: 0, scores: [] };
            }
            acc[week].total += metric.score;
            acc[week].count += 1;
            acc[week].scores.push(metric.score);
            return acc;
        }, {});
        return Object.entries(weeklyData)
            .map(([week, data]) => ({
            week: parseInt(week),
            averageScore: Math.round(data.total / data.count),
            patientCount: data.count,
            minScore: Math.min(...data.scores),
            maxScore: Math.max(...data.scores)
        }))
            .sort((a, b) => a.week - b.week)
            .slice(-12);
    }
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    async validatePatientData(patientId) {
        const patient = await this.patientRepository.findOne({
            where: { id: patientId },
            relations: ['images', 'treatments']
        });
        if (!patient) {
            return {
                isValid: false,
                errors: ['Patient not found'],
                warnings: []
            };
        }
        const errors = [];
        const warnings = [];
        if (!patient.name)
            errors.push('Patient name is required');
        if (!patient.idNumber)
            errors.push('Patient ID number is required');
        if (!patient.birthDate)
            errors.push('Birth date is required');
        if (!patient.gender)
            errors.push('Gender is required');
        if (!patient.diagnosisDate)
            errors.push('Diagnosis date is required');
        if (patient.idNumber) {
            const idPattern = /^[0-9]{16}$/;
            if (!idPattern.test(patient.idNumber)) {
                warnings.push('ID number format may be invalid (expected 16 digits)');
            }
        }
        if (patient.birthDate && patient.diagnosisDate) {
            const birth = new Date(patient.birthDate);
            const diagnosis = new Date(patient.diagnosisDate);
            const now = new Date();
            if (birth >= diagnosis) {
                errors.push('Birth date cannot be after diagnosis date');
            }
            if (birth >= now) {
                errors.push('Birth date cannot be in the future');
            }
            if (diagnosis > now) {
                warnings.push('Diagnosis date is in the future');
            }
            const ageAtDiagnosis = diagnosis.getFullYear() - birth.getFullYear();
            if (ageAtDiagnosis > 120 || ageAtDiagnosis < 0) {
                warnings.push('Patient age at diagnosis seems unrealistic');
            }
        }
        if (patient.stage && !patient.tumorType) {
            warnings.push('Cancer stage specified but tumor type is missing');
        }
        const images = patient.images || [];
        if (images.length === 0) {
            warnings.push('No medical imaging available');
        }
        else {
            const hasDicom = images.some(img => img.category === 'dicom');
            if (!hasDicom) {
                warnings.push('No DICOM images found (recommended for cancer diagnosis)');
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
};
exports.QualityService = QualityService;
exports.QualityService = QualityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(1, (0, typeorm_1.InjectRepository)(medical_image_entity_1.MedicalImage)),
    __param(2, (0, typeorm_1.InjectRepository)(quality_metric_entity_1.QualityMetric)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], QualityService);
//# sourceMappingURL=quality.service.js.map