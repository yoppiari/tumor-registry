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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreatmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
let TreatmentsService = class TreatmentsService {
    constructor(treatmentPlanModel, treatmentSessionModel, treatmentProtocolModel, medicalRecordModel, qualityMetricsModel, treatmentReportModel) {
        this.treatmentPlanModel = treatmentPlanModel;
        this.treatmentSessionModel = treatmentSessionModel;
        this.treatmentProtocolModel = treatmentProtocolModel;
        this.medicalRecordModel = medicalRecordModel;
        this.qualityMetricsModel = qualityMetricsModel;
        this.treatmentReportModel = treatmentReportModel;
    }
    async createTreatmentPlan(createTreatmentPlanDto, createdBy) {
        const existingPlan = await this.treatmentPlanModel.findOne({
            patientId: createTreatmentPlanDto.patientId,
            status: { $in: ['planned', 'active'] },
            isActive: true
        });
        if (existingPlan) {
            throw new common_1.ConflictException('Patient already has an active treatment plan');
        }
        const planId = (0, uuid_1.v4)();
        const treatmentPlan = {
            id: planId,
            patientId: createTreatmentPlanDto.patientId,
            planName: createTreatmentPlanDto.planName,
            planCode: createTreatmentPlanDto.planCode,
            primaryCancerSite: createTreatmentPlanDto.primaryCancerSite,
            cancerStage: createTreatmentPlanDto.cancerStage,
            histology: createTreatmentPlanDto.histology,
            modalities: createTreatmentPlanDto.modalities.map(modality => ({
                ...modality,
                id: (0, uuid_1.v4)()
            })),
            intent: createTreatmentPlanDto.intent,
            protocolName: createTreatmentPlanDto.protocolName,
            protocolVersion: createTreatmentPlanDto.protocolVersion,
            protocolCategory: createTreatmentPlanDto.protocolCategory,
            primaryOncologist: {
                ...createTreatmentPlanDto.primaryOncologist,
                id: (0, uuid_1.v4)(),
                isActive: true,
                isPrimary: true
            },
            multidisciplinaryTeam: createTreatmentPlanDto.multidisciplinaryTeam?.map(member => ({
                ...member,
                id: (0, uuid_1.v4)(),
                isActive: true
            })) || [],
            startDate: createTreatmentPlanDto.startDate,
            expectedEndDate: createTreatmentPlanDto.expectedEndDate,
            totalCycles: createTreatmentPlanDto.totalCycles,
            completedCycles: 0,
            status: 'planned',
            phase: 'initial',
            adherence: {
                overallAdherence: 100,
                missedSessions: 0,
                postponedSessions: 0,
                doseModifications: 0,
                delays: [],
                adherenceScore: 'excellent'
            },
            baselineAssessment: {
                ...createTreatmentPlanDto.baselineAssessment,
                diseaseAssessment: {
                    ...createTreatmentPlanDto.baselineAssessment.diseaseAssessment,
                    lesionMeasurements: createTreatmentPlanDto.baselineAssessment.diseaseAssessment.lesionMeasurements.map(measurement => ({
                        ...measurement,
                        id: (0, uuid_1.v4)()
                    }))
                },
                laboratoryValues: createTreatmentPlanDto.baselineAssessment.laboratoryValues?.map(lab => ({
                    ...lab,
                    id: (0, uuid_1.v4)()
                })) || [],
                imagingStudies: createTreatmentPlanDto.baselineAssessment.imagingStudies?.map(study => ({
                    ...study,
                    id: (0, uuid_1.v4)()
                })) || []
            },
            isActive: true,
            isDeceased: false,
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const newTreatmentPlan = new this.treatmentPlanModel(treatmentPlan);
        return await newTreatmentPlan.save();
    }
    async findAllTreatmentPlans(searchDto) {
        const { page = 1, limit = 10, patientId, status, modality, intent, primaryOncologist, sortBy = 'createdAt', sortOrder = 'desc', dateRange } = searchDto;
        const skip = (page - 1) * limit;
        const query = { isActive: true };
        if (patientId)
            query.patientId = patientId;
        if (status)
            query.status = status;
        if (intent)
            query.intent = intent;
        if (primaryOncologist)
            query['primaryOncologist.name'] = new RegExp(primaryOncologist, 'i');
        if (modality) {
            query['modalities.type'] = modality;
        }
        if (dateRange) {
            query.startDate = {
                $gte: new Date(dateRange.startDate),
                $lte: new Date(dateRange.endDate)
            };
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const [treatmentPlans, total] = await Promise.all([
            this.treatmentPlanModel
                .find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.treatmentPlanModel.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            treatmentPlans,
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1
        };
    }
    async findTreatmentPlanById(id) {
        const treatmentPlan = await this.treatmentPlanModel
            .findOne({ id, isActive: true })
            .lean()
            .exec();
        if (!treatmentPlan) {
            throw new common_1.NotFoundException(`Treatment plan with ID ${id} not found`);
        }
        return treatmentPlan;
    }
    async updateTreatmentPlan(id, updateTreatmentPlanDto, updatedBy) {
        const treatmentPlan = await this.findTreatmentPlanById(id);
        const updatedPlan = {
            ...treatmentPlan,
            ...updateTreatmentPlanDto,
            updatedBy,
            updatedAt: new Date()
        };
        await this.treatmentPlanModel.updateOne({ id }, updatedPlan);
        return updatedPlan;
    }
    async activateTreatmentPlan(id, activatedBy) {
        const treatmentPlan = await this.findTreatmentPlanById(id);
        if (treatmentPlan.status !== 'planned') {
            throw new common_1.BadRequestException('Only planned treatment plans can be activated');
        }
        const updatedPlan = {
            ...treatmentPlan,
            status: 'active',
            updatedBy: activatedBy,
            updatedAt: new Date()
        };
        await this.treatmentPlanModel.updateOne({ id }, updatedPlan);
        return updatedPlan;
    }
    async completeTreatmentPlan(id, completedBy) {
        const treatmentPlan = await this.findTreatmentPlanById(id);
        if (treatmentPlan.status !== 'active') {
            throw new common_1.BadRequestException('Only active treatment plans can be completed');
        }
        const updatedPlan = {
            ...treatmentPlan,
            status: 'completed',
            actualEndDate: new Date(),
            completedCycles: treatmentPlan.totalCycles,
            updatedBy: completedBy,
            updatedAt: new Date()
        };
        await this.treatmentPlanModel.updateOne({ id }, updatedPlan);
        return updatedPlan;
    }
    async createTreatmentSession(createTreatmentSessionDto, createdBy) {
        const treatmentPlan = await this.findTreatmentPlanById(createTreatmentSessionDto.treatmentPlanId);
        if (treatmentPlan.status !== 'active') {
            throw new common_1.BadRequestException('Treatment sessions can only be created for active treatment plans');
        }
        const lastSession = await this.treatmentSessionModel
            .findOne({ treatmentPlanId: createTreatmentSessionDto.treatmentPlanId })
            .sort({ sessionNumber: -1 })
            .lean()
            .exec();
        const sessionNumber = (lastSession?.sessionNumber || 0) + 1;
        const treatmentSession = {
            id: (0, uuid_1.v4)(),
            treatmentPlanId: createTreatmentSessionDto.treatmentPlanId,
            sessionNumber,
            sessionDate: createTreatmentSessionDto.sessionDate,
            modality: createTreatmentSessionDto.modality,
            duration: createTreatmentSessionDto.duration || 0,
            preAssessment: {
                ...createTreatmentSessionDto.preAssessment,
                assessedAt: new Date()
            },
            medications: createTreatmentSessionDto.medications?.map(med => ({
                ...med,
                id: (0, uuid_1.v4)()
            })) || [],
            procedures: createTreatmentSessionDto.procedures?.map(proc => ({
                ...proc,
                id: (0, uuid_1.v4)()
            })) || [],
            performedBy: {
                ...createTreatmentSessionDto.performedBy,
                id: (0, uuid_1.v4)(),
                isActive: true
            },
            supervisedBy: createTreatmentSessionDto.supervisedBy ? {
                ...createTreatmentSessionDto.supervisedBy,
                id: (0, uuid_1.v4)(),
                isActive: true
            } : undefined,
            status: 'scheduled',
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const newSession = new this.treatmentSessionModel(treatmentSession);
        return await newSession.save();
    }
    async findTreatmentSessionsByPlan(treatmentPlanId) {
        return await this.treatmentSessionModel
            .find({ treatmentPlanId })
            .sort({ sessionNumber: 1 })
            .lean()
            .exec();
    }
    async completeTreatmentSession(sessionId, postAssessmentData, completedBy) {
        const session = await this.treatmentSessionModel
            .findOne({ id: sessionId })
            .lean()
            .exec();
        if (!session) {
            throw new common_1.NotFoundException(`Treatment session with ID ${sessionId} not found`);
        }
        if (session.status !== 'in_progress') {
            throw new common_1.BadRequestException('Only in-progress sessions can be completed');
        }
        const updatedSession = {
            ...session,
            status: 'completed',
            postAssessment: {
                ...postAssessmentData,
                assessedAt: new Date()
            },
            updatedBy: completedBy,
            updatedAt: new Date()
        };
        await this.treatmentSessionModel.updateOne({ id: sessionId }, updatedSession);
        await this.updateTreatmentPlanProgress(session.treatmentPlanId);
        return updatedSession;
    }
    async updateTreatmentPlanProgress(treatmentPlanId) {
        const sessions = await this.findTreatmentSessionsByPlan(treatmentPlanId);
        const completedSessions = sessions.filter(s => s.status === 'completed');
        const missedSessions = sessions.filter(s => s.status === 'missed' || s.status === 'cancelled');
        const adherence = {
            overallAdherence: Math.round((completedSessions.length / sessions.length) * 100),
            missedSessions: missedSessions.length,
            postponedSessions: sessions.filter(s => s.status === 'postponed').length,
            doseModifications: 0,
            delays: [],
            adherenceScore: this.calculateAdherenceScore(completedSessions.length, sessions.length)
        };
        const completedCycles = Math.floor(completedSessions.length / 4);
        await this.treatmentPlanModel.updateOne({ id: treatmentPlanId }, {
            adherence,
            completedCycles,
            updatedAt: new Date()
        });
    }
    calculateAdherenceScore(completed, total) {
        const percentage = (completed / total) * 100;
        if (percentage >= 95)
            return 'excellent';
        if (percentage >= 85)
            return 'good';
        if (percentage >= 70)
            return 'fair';
        return 'poor';
    }
    async createMedicalRecord(createMedicalRecordDto, createdBy) {
        const medicalRecord = {
            id: (0, uuid_1.v4)(),
            patientId: createMedicalRecordDto.patientId,
            recordType: createMedicalRecordDto.recordType,
            title: createMedicalRecordDto.title,
            content: createMedicalRecordDto.content,
            summary: createMedicalRecordDto.summary,
            serviceType: createMedicalRecordDto.serviceType,
            department: createMedicalRecordDto.department,
            encounterType: createMedicalRecordDto.encounterType,
            primaryProvider: {
                ...createMedicalRecordDto.primaryProvider,
                id: (0, uuid_1.v4)(),
                isActive: true
            },
            consultingProviders: createMedicalRecordDto.consultingProviders?.map(provider => ({
                ...provider,
                id: (0, uuid_1.v4)(),
                isActive: true
            })) || [],
            serviceDate: createMedicalRecordDto.serviceDate,
            documentationDate: createMedicalRecordDto.documentationDate || new Date(),
            lastUpdated: new Date(),
            diagnosis: createMedicalRecordDto.diagnosis?.map(diag => ({
                ...diag,
                id: (0, uuid_1.v4)()
            })) || [],
            medications: createMedicalRecordDto.medications?.map(med => ({
                ...med,
                id: (0, uuid_1.v4)()
            })) || [],
            procedures: createMedicalRecordDto.procedures?.map(proc => ({
                ...proc,
                id: (0, uuid_1.v4)()
            })) || [],
            vitals: createMedicalRecordDto.vitals,
            labs: createMedicalRecordDto.labs?.map(lab => ({
                ...lab,
                id: (0, uuid_1.v4)()
            })) || [],
            imaging: createMedicalRecordDto.imaging?.map(img => ({
                ...img,
                id: (0, uuid_1.v4)()
            })) || [],
            assessment: createMedicalRecordDto.assessment,
            plan: createMedicalRecordDto.plan,
            followUp: createMedicalRecordDto.followUp,
            coded: false,
            codedDiagnoses: [],
            codedProcedures: [],
            reviewed: false,
            version: 1,
            status: 'final',
            source: 'manual_entry',
            createdBy,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const newRecord = new this.medicalRecordModel(medicalRecord);
        return await newRecord.save();
    }
    async findMedicalRecordsByPatient(patientId, limit = 50) {
        return await this.medicalRecordModel
            .find({ patientId })
            .sort({ serviceDate: -1 })
            .limit(limit)
            .lean()
            .exec();
    }
    async calculateQualityMetrics(treatmentPlanId) {
        const treatmentPlan = await this.findTreatmentPlanById(treatmentPlanId);
        const sessions = await this.findTreatmentSessionsByPlan(treatmentPlanId);
        const timeToTreatment = treatmentPlan.startDate ?
            Math.floor((treatmentPlan.startDate.getTime() - treatmentPlan.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0;
        const guidelineConcordance = this.calculateGuidelineConcordance(treatmentPlan);
        const completedSessions = sessions.filter(s => s.status === 'completed');
        const toxicities = sessions.filter(s => s.postAssessment?.immediateToxicities?.some(t => t.grade >= 3));
        const qualityMetrics = {
            id: (0, uuid_1.v4)(),
            treatmentPlanId,
            metricDate: new Date(),
            timeToTreatment,
            guidelineConcordance,
            multidisciplinaryReview: treatmentPlan.multidisciplinaryTeam.length > 1,
            clinicalTrialDiscussion: false,
            treatmentCompletion: treatmentPlan.status === 'completed',
            doseIntensity: this.calculateRelativeDoseIntensity(treatmentPlan, sessions),
            toxicityRate: toxicities.length > 0 ? (toxicities.length / sessions.length) * 100 : 0,
            emergencyVisits: 0,
            hospitalizations: 0,
            calculatedBy: 'system',
            createdAt: new Date()
        };
        return qualityMetrics;
    }
    calculateGuidelineConcordance(treatmentPlan) {
        let concordanceScore = 100;
        if (treatmentPlan.protocolCategory === 'standard') {
            concordanceScore += 0;
        }
        else if (treatmentPlan.protocolCategory === 'clinical_trial') {
            concordanceScore += 5;
        }
        else {
            concordanceScore -= 10;
        }
        if (treatmentPlan.multidisciplinaryTeam.length < 2) {
            concordanceScore -= 5;
        }
        return Math.max(0, Math.min(100, concordanceScore));
    }
    calculateRelativeDoseIntensity(treatmentPlan, sessions) {
        if (!treatmentPlan.totalCycles || sessions.length === 0)
            return 100;
        const completedSessions = sessions.filter(s => s.status === 'completed');
        const expectedSessions = treatmentPlan.totalCycles * 4;
        return (completedSessions.length / expectedSessions) * 100;
    }
    async generateTreatmentReport(generateReportDto, generatedBy) {
        const { reportType, patientIds, treatmentPlanIds, dateRange } = generateReportDto;
        let data = {};
        switch (reportType) {
            case 'treatment_summary':
                data = await this.generateTreatmentSummaryReport(treatmentPlanIds);
                break;
            case 'progress_report':
                data = await this.generateProgressReport(patientIds, dateRange);
                break;
            case 'outcome_analysis':
                data = await this.generateOutcomeAnalysisReport(treatmentPlanIds);
                break;
            case 'quality_metrics':
                data = await this.generateQualityMetricsReport(treatmentPlanIds);
                break;
            case 'adverse_events':
                data = await this.generateAdverseEventsReport(treatmentPlanIds, dateRange);
                break;
            default:
                throw new common_1.BadRequestException(`Unsupported report type: ${reportType}`);
        }
        const report = {
            id: (0, uuid_1.v4)(),
            reportType,
            title: `${reportType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Report`,
            description: `Generated report for ${reportType}`,
            patientIds,
            treatmentPlanIds,
            dateRange,
            data,
            summary: this.generateReportSummary(data, reportType),
            insights: this.generateReportInsights(data, reportType),
            recommendations: this.generateReportRecommendations(data, reportType),
            format: 'json',
            generatedBy,
            generatedAt: new Date(),
            parameters: generateReportDto
        };
        const newReport = new this.treatmentReportModel(report);
        return await newReport.save();
    }
    async generateTreatmentSummaryReport(treatmentPlanIds) {
        const treatmentPlans = await this.treatmentPlanModel
            .find({ id: { $in: treatmentPlanIds } })
            .lean()
            .exec();
        return {
            summary: {
                totalPlans: treatmentPlans.length,
                activePlans: treatmentPlans.filter(p => p.status === 'active').length,
                completedPlans: treatmentPlans.filter(p => p.status === 'completed').length,
                averageDuration: this.calculateAverageTreatmentDuration(treatmentPlans)
            },
            plans: treatmentPlans.map(plan => ({
                id: plan.id,
                patientId: plan.patientId,
                planName: plan.planName,
                primaryCancerSite: plan.primaryCancerSite,
                cancerStage: plan.cancerStage,
                intent: plan.intent,
                status: plan.status,
                startDate: plan.startDate,
                endDate: plan.actualEndDate || plan.expectedEndDate,
                modalities: plan.modalities.map(m => m.type),
                adherence: plan.adherence.overallAdherence
            }))
        };
    }
    async generateProgressReport(patientIds, dateRange) {
        return {
            message: 'Progress report generation - to be implemented'
        };
    }
    async generateOutcomeAnalysisReport(treatmentPlanIds) {
        return {
            message: 'Outcome analysis report generation - to be implemented'
        };
    }
    async generateQualityMetricsReport(treatmentPlanIds) {
        const metrics = await Promise.all(treatmentPlanIds.map(id => this.calculateQualityMetrics(id)));
        return {
            summary: {
                averageTimeToTreatment: metrics.reduce((sum, m) => sum + m.timeToTreatment, 0) / metrics.length,
                averageGuidelineConcordance: metrics.reduce((sum, m) => sum + m.guidelineConcordance, 0) / metrics.length,
                averageDoseIntensity: metrics.reduce((sum, m) => sum + m.doseIntensity, 0) / metrics.length,
                averageToxicityRate: metrics.reduce((sum, m) => sum + m.toxicityRate, 0) / metrics.length
            },
            metrics
        };
    }
    async generateAdverseEventsReport(treatmentPlanIds, dateRange) {
        return {
            message: 'Adverse events report generation - to be implemented'
        };
    }
    calculateAverageTreatmentDuration(treatmentPlans) {
        const completedPlans = treatmentPlans.filter(p => p.status === 'completed' && p.startDate && p.actualEndDate);
        if (completedPlans.length === 0)
            return 0;
        const totalDays = completedPlans.reduce((sum, plan) => {
            return sum + (plan.actualEndDate.getTime() - plan.startDate.getTime()) / (1000 * 60 * 60 * 24);
        }, 0);
        return Math.round(totalDays / completedPlans.length);
    }
    generateReportSummary(data, reportType) {
        switch (reportType) {
            case 'treatment_summary':
                return `Generated treatment summary for ${data.summary.totalPlans} treatment plans`;
            case 'quality_metrics':
                return `Quality metrics analysis showing ${data.summary.averageGuidelineConcordance.toFixed(1)}% guideline concordance`;
            default:
                return `Report generated successfully`;
        }
    }
    generateReportInsights(data, reportType) {
        const insights = [];
        switch (reportType) {
            case 'treatment_summary':
                if (data.summary.averageDuration > 180) {
                    insights.push('Average treatment duration exceeds 6 months - consider efficiency improvements');
                }
                break;
            case 'quality_metrics':
                if (data.summary.averageGuidelineConcordance < 90) {
                    insights.push('Guideline concordance below 90% - review protocol adherence');
                }
                break;
        }
        return insights;
    }
    generateReportRecommendations(data, reportType) {
        const recommendations = [];
        switch (reportType) {
            case 'quality_metrics':
                if (data.summary.averageDoseIntensity < 85) {
                    recommendations.push('Review dose modification protocols and supportive care measures');
                }
                break;
        }
        return recommendations;
    }
};
exports.TreatmentsService = TreatmentsService;
exports.TreatmentsService = TreatmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('TreatmentPlan')),
    __param(1, (0, mongoose_1.InjectModel)('TreatmentSession')),
    __param(2, (0, mongoose_1.InjectModel)('TreatmentProtocol')),
    __param(3, (0, mongoose_1.InjectModel)('MedicalRecord')),
    __param(4, (0, mongoose_1.InjectModel)('QualityMetrics')),
    __param(5, (0, mongoose_1.InjectModel)('TreatmentReport')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _f : Object])
], TreatmentsService);
//# sourceMappingURL=treatments.service.js.map