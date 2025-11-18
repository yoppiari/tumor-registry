import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  TreatmentPlan,
  TreatmentSession,
  TreatmentProtocol,
  MedicalRecord,
  QualityMetrics,
  TreatmentReport
} from './interfaces/treatment.interface';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { CreateTreatmentSessionDto } from './dto/create-treatment-session.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { SearchTreatmentDto } from './dto/search-treatment.dto';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { GenerateReportDto } from './dto/generate-report.dto';

@Injectable()
export class TreatmentsService {
  constructor(
    @InjectModel('TreatmentPlan') private treatmentPlanModel: Model<TreatmentPlan>,
    @InjectModel('TreatmentSession') private treatmentSessionModel: Model<TreatmentSession>,
    @InjectModel('TreatmentProtocol') private treatmentProtocolModel: Model<TreatmentProtocol>,
    @InjectModel('MedicalRecord') private medicalRecordModel: Model<MedicalRecord>,
    @InjectModel('QualityMetrics') private qualityMetricsModel: Model<QualityMetrics>,
    @InjectModel('TreatmentReport') private treatmentReportModel: Model<TreatmentReport>,
  ) {}

  // Treatment Plan Management
  async createTreatmentPlan(createTreatmentPlanDto: CreateTreatmentPlanDto, createdBy: string): Promise<TreatmentPlan> {
    // Check if patient already has an active treatment plan
    const existingPlan = await this.treatmentPlanModel.findOne({
      patientId: createTreatmentPlanDto.patientId,
      status: { $in: ['planned', 'active'] },
      isActive: true
    });

    if (existingPlan) {
      throw new ConflictException('Patient already has an active treatment plan');
    }

    // Generate treatment plan ID
    const planId = uuidv4();

    // Create treatment plan
    const treatmentPlan: TreatmentPlan = {
      id: planId,
      patientId: createTreatmentPlanDto.patientId,
      planName: createTreatmentPlanDto.planName,
      planCode: createTreatmentPlanDto.planCode,
      primaryCancerSite: createTreatmentPlanDto.primaryCancerSite,
      cancerStage: createTreatmentPlanDto.cancerStage,
      histology: createTreatmentPlanDto.histology,
      modalities: createTreatmentPlanDto.modalities.map(modality => ({
        ...modality,
        id: uuidv4()
      })),
      intent: createTreatmentPlanDto.intent,
      protocolName: createTreatmentPlanDto.protocolName,
      protocolVersion: createTreatmentPlanDto.protocolVersion,
      protocolCategory: createTreatmentPlanDto.protocolCategory,
      primaryOncologist: {
        ...createTreatmentPlanDto.primaryOncologist,
        id: uuidv4(),
        isActive: true,
        isPrimary: true
      },
      multidisciplinaryTeam: createTreatmentPlanDto.multidisciplinaryTeam?.map(member => ({
        ...member,
        id: uuidv4(),
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
            id: uuidv4()
          }))
        },
        laboratoryValues: createTreatmentPlanDto.baselineAssessment.laboratoryValues?.map(lab => ({
          ...lab,
          id: uuidv4()
        })) || [],
        imagingStudies: createTreatmentPlanDto.baselineAssessment.imagingStudies?.map(study => ({
          ...study,
          id: uuidv4()
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

  async findAllTreatmentPlans(searchDto: SearchTreatmentDto): Promise<{
    treatmentPlans: TreatmentPlan[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    const {
      page = 1,
      limit = 10,
      patientId,
      status,
      modality,
      intent,
      primaryOncologist,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      dateRange
    } = searchDto;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = { isActive: true };

    if (patientId) query.patientId = patientId;
    if (status) query.status = status;
    if (intent) query.intent = intent;
    if (primaryOncologist) query['primaryOncologist.name'] = new RegExp(primaryOncologist, 'i');

    if (modality) {
      query['modalities.type'] = modality;
    }

    if (dateRange) {
      query.startDate = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate)
      };
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
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

  async findTreatmentPlanById(id: string): Promise<TreatmentPlan> {
    const treatmentPlan = await this.treatmentPlanModel
      .findOne({ id, isActive: true })
      .lean()
      .exec();

    if (!treatmentPlan) {
      throw new NotFoundException(`Treatment plan with ID ${id} not found`);
    }

    return treatmentPlan;
  }

  async updateTreatmentPlan(id: string, updateTreatmentPlanDto: UpdateTreatmentPlanDto, updatedBy: string): Promise<TreatmentPlan> {
    const treatmentPlan = await this.findTreatmentPlanById(id);

    const updatedPlan = {
      ...treatmentPlan,
      ...updateTreatmentPlanDto,
      updatedBy,
      updatedAt: new Date()
    };

    await this.treatmentPlanModel.updateOne(
      { id },
      updatedPlan
    );

    return updatedPlan;
  }

  async activateTreatmentPlan(id: string, activatedBy: string): Promise<TreatmentPlan> {
    const treatmentPlan = await this.findTreatmentPlanById(id);

    if (treatmentPlan.status !== 'planned') {
      throw new BadRequestException('Only planned treatment plans can be activated');
    }

    const updatedPlan = {
      ...treatmentPlan,
      status: 'active',
      updatedBy: activatedBy,
      updatedAt: new Date()
    };

    await this.treatmentPlanModel.updateOne(
      { id },
      updatedPlan
    );

    return updatedPlan;
  }

  async completeTreatmentPlan(id: string, completedBy: string): Promise<TreatmentPlan> {
    const treatmentPlan = await this.findTreatmentPlanById(id);

    if (treatmentPlan.status !== 'active') {
      throw new BadRequestException('Only active treatment plans can be completed');
    }

    const updatedPlan = {
      ...treatmentPlan,
      status: 'completed',
      actualEndDate: new Date(),
      completedCycles: treatmentPlan.totalCycles,
      updatedBy: completedBy,
      updatedAt: new Date()
    };

    await this.treatmentPlanModel.updateOne(
      { id },
      updatedPlan
    );

    return updatedPlan;
  }

  // Treatment Session Management
  async createTreatmentSession(createTreatmentSessionDto: CreateTreatmentSessionDto, createdBy: string): Promise<TreatmentSession> {
    // Verify treatment plan exists and is active
    const treatmentPlan = await this.findTreatmentPlanById(createTreatmentSessionDto.treatmentPlanId);

    if (treatmentPlan.status !== 'active') {
      throw new BadRequestException('Treatment sessions can only be created for active treatment plans');
    }

    // Generate session number
    const lastSession = await this.treatmentSessionModel
      .findOne({ treatmentPlanId: createTreatmentSessionDto.treatmentPlanId })
      .sort({ sessionNumber: -1 })
      .lean()
      .exec();

    const sessionNumber = (lastSession?.sessionNumber || 0) + 1;

    const treatmentSession: TreatmentSession = {
      id: uuidv4(),
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
        id: uuidv4()
      })) || [],
      procedures: createTreatmentSessionDto.procedures?.map(proc => ({
        ...proc,
        id: uuidv4()
      })) || [],
      performedBy: {
        ...createTreatmentSessionDto.performedBy,
        id: uuidv4(),
        isActive: true
      },
      supervisedBy: createTreatmentSessionDto.supervisedBy ? {
        ...createTreatmentSessionDto.supervisedBy,
        id: uuidv4(),
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

  async findTreatmentSessionsByPlan(treatmentPlanId: string): Promise<TreatmentSession[]> {
    return await this.treatmentSessionModel
      .find({ treatmentPlanId })
      .sort({ sessionNumber: 1 })
      .lean()
      .exec();
  }

  async completeTreatmentSession(sessionId: string, postAssessmentData: any, completedBy: string): Promise<TreatmentSession> {
    const session = await this.treatmentSessionModel
      .findOne({ id: sessionId })
      .lean()
      .exec();

    if (!session) {
      throw new NotFoundException(`Treatment session with ID ${sessionId} not found`);
    }

    if (session.status !== 'in_progress') {
      throw new BadRequestException('Only in-progress sessions can be completed');
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

    await this.treatmentSessionModel.updateOne(
      { id: sessionId },
      updatedSession
    );

    // Update treatment plan adherence and cycle count
    await this.updateTreatmentPlanProgress(session.treatmentPlanId);

    return updatedSession;
  }

  private async updateTreatmentPlanProgress(treatmentPlanId: string): Promise<void> {
    const sessions = await this.findTreatmentSessionsByPlan(treatmentPlanId);
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const missedSessions = sessions.filter(s => s.status === 'missed' || s.status === 'cancelled');

    const adherence = {
      overallAdherence: Math.round((completedSessions.length / sessions.length) * 100),
      missedSessions: missedSessions.length,
      postponedSessions: sessions.filter(s => s.status === 'postponed').length,
      doseModifications: 0, // Will be updated based on dose modification records
      delays: [], // Will be updated based on schedule changes
      adherenceScore: this.calculateAdherenceScore(completedSessions.length, sessions.length)
    };

    const completedCycles = Math.floor(completedSessions.length / 4); // Assuming 4 sessions per cycle

    await this.treatmentPlanModel.updateOne(
      { id: treatmentPlanId },
      {
        adherence,
        completedCycles,
        updatedAt: new Date()
      }
    );
  }

  private calculateAdherenceScore(completed: number, total: number): 'excellent' | 'good' | 'fair' | 'poor' {
    const percentage = (completed / total) * 100;
    if (percentage >= 95) return 'excellent';
    if (percentage >= 85) return 'good';
    if (percentage >= 70) return 'fair';
    return 'poor';
  }

  // Medical Records Management
  async createMedicalRecord(createMedicalRecordDto: CreateMedicalRecordDto, createdBy: string): Promise<MedicalRecord> {
    const medicalRecord: MedicalRecord = {
      id: uuidv4(),
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
        id: uuidv4(),
        isActive: true
      },
      consultingProviders: createMedicalRecordDto.consultingProviders?.map(provider => ({
        ...provider,
        id: uuidv4(),
        isActive: true
      })) || [],
      serviceDate: createMedicalRecordDto.serviceDate,
      documentationDate: createMedicalRecordDto.documentationDate || new Date(),
      lastUpdated: new Date(),
      diagnosis: createMedicalRecordDto.diagnosis?.map(diag => ({
        ...diag,
        id: uuidv4()
      })) || [],
      medications: createMedicalRecordDto.medications?.map(med => ({
        ...med,
        id: uuidv4()
      })) || [],
      procedures: createMedicalRecordDto.procedures?.map(proc => ({
        ...proc,
        id: uuidv4()
      })) || [],
      vitals: createMedicalRecordDto.vitals,
      labs: createMedicalRecordDto.labs?.map(lab => ({
        ...lab,
        id: uuidv4()
      })) || [],
      imaging: createMedicalRecordDto.imaging?.map(img => ({
        ...img,
        id: uuidv4()
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

  async findMedicalRecordsByPatient(patientId: string, limit: number = 50): Promise<MedicalRecord[]> {
    return await this.medicalRecordModel
      .find({ patientId })
      .sort({ serviceDate: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  // Quality Metrics
  async calculateQualityMetrics(treatmentPlanId: string): Promise<QualityMetrics> {
    const treatmentPlan = await this.findTreatmentPlanById(treatmentPlanId);
    const sessions = await this.findTreatmentSessionsByPlan(treatmentPlanId);

    // Calculate time to treatment (days from diagnosis to first treatment)
    const timeToTreatment = treatmentPlan.startDate ?
      Math.floor((treatmentPlan.startDate.getTime() - treatmentPlan.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Calculate guideline concordance (simplified - would integrate with clinical guidelines)
    const guidelineConcordance = this.calculateGuidelineConcordance(treatmentPlan);

    // Calculate other metrics
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const toxicities = sessions.filter(s => s.postAssessment?.immediateToxicities?.some(t => t.grade >= 3));

    const qualityMetrics: QualityMetrics = {
      id: uuidv4(),
      treatmentPlanId,
      metricDate: new Date(),
      timeToTreatment,
      guidelineConcordance,
      multidisciplinaryReview: treatmentPlan.multidisciplinaryTeam.length > 1,
      clinicalTrialDiscussion: false, // Would be tracked separately
      treatmentCompletion: treatmentPlan.status === 'completed',
      doseIntensity: this.calculateRelativeDoseIntensity(treatmentPlan, sessions),
      toxicityRate: toxicities.length > 0 ? (toxicities.length / sessions.length) * 100 : 0,
      emergencyVisits: 0, // Would be tracked from emergency records
      hospitalizations: 0, // Would be tracked from admission records
      calculatedBy: 'system',
      createdAt: new Date()
    };

    return qualityMetrics;
  }

  private calculateGuidelineConcordance(treatmentPlan: TreatmentPlan): number {
    // Simplified calculation - would integrate with actual clinical guidelines
    let concordanceScore = 100;

    // Check if standard protocol is used
    if (treatmentPlan.protocolCategory === 'standard') {
      concordanceScore += 0;
    } else if (treatmentPlan.protocolCategory === 'clinical_trial') {
      concordanceScore += 5; // Clinical trials are often superior
    } else {
      concordanceScore -= 10; // Non-standard protocols reduce concordance
    }

    // Check multidisciplinary team involvement
    if (treatmentPlan.multidisciplinaryTeam.length < 2) {
      concordanceScore -= 5;
    }

    return Math.max(0, Math.min(100, concordanceScore));
  }

  private calculateRelativeDoseIntensity(treatmentPlan: TreatmentPlan, sessions: TreatmentSession[]): number {
    // Simplified RDI calculation
    if (!treatmentPlan.totalCycles || sessions.length === 0) return 100;

    const completedSessions = sessions.filter(s => s.status === 'completed');
    const expectedSessions = treatmentPlan.totalCycles * 4; // Assuming 4 sessions per cycle

    return (completedSessions.length / expectedSessions) * 100;
  }

  // Reporting
  async generateTreatmentReport(generateReportDto: GenerateReportDto, generatedBy: string): Promise<TreatmentReport> {
    const { reportType, patientIds, treatmentPlanIds, dateRange } = generateReportDto;

    let data: any = {};

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
        throw new BadRequestException(`Unsupported report type: ${reportType}`);
    }

    const report: TreatmentReport = {
      id: uuidv4(),
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

  private async generateTreatmentSummaryReport(treatmentPlanIds: string[]): Promise<any> {
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

  private async generateProgressReport(patientIds: string[], dateRange: any): Promise<any> {
    // Implementation would query treatment progress for specified patients within date range
    return {
      message: 'Progress report generation - to be implemented'
    };
  }

  private async generateOutcomeAnalysisReport(treatmentPlanIds: string[]): Promise<any> {
    // Implementation would analyze treatment outcomes
    return {
      message: 'Outcome analysis report generation - to be implemented'
    };
  }

  private async generateQualityMetricsReport(treatmentPlanIds: string[]): Promise<any> {
    const metrics = await Promise.all(
      treatmentPlanIds.map(id => this.calculateQualityMetrics(id))
    );

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

  private async generateAdverseEventsReport(treatmentPlanIds: string[], dateRange: any): Promise<any> {
    // Implementation would extract and analyze adverse events
    return {
      message: 'Adverse events report generation - to be implemented'
    };
  }

  private calculateAverageTreatmentDuration(treatmentPlans: TreatmentPlan[]): number {
    const completedPlans = treatmentPlans.filter(p => p.status === 'completed' && p.startDate && p.actualEndDate);
    if (completedPlans.length === 0) return 0;

    const totalDays = completedPlans.reduce((sum, plan) => {
      return sum + (plan.actualEndDate!.getTime() - plan.startDate!.getTime()) / (1000 * 60 * 60 * 24);
    }, 0);

    return Math.round(totalDays / completedPlans.length);
  }

  private generateReportSummary(data: any, reportType: string): string {
    switch (reportType) {
      case 'treatment_summary':
        return `Generated treatment summary for ${data.summary.totalPlans} treatment plans`;
      case 'quality_metrics':
        return `Quality metrics analysis showing ${data.summary.averageGuidelineConcordance.toFixed(1)}% guideline concordance`;
      default:
        return `Report generated successfully`;
    }
  }

  private generateReportInsights(data: any, reportType: string): string[] {
    const insights: string[] = [];

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

  private generateReportRecommendations(data: any, reportType: string): string[] {
    const recommendations: string[] = [];

    switch (reportType) {
      case 'quality_metrics':
        if (data.summary.averageDoseIntensity < 85) {
          recommendations.push('Review dose modification protocols and supportive care measures');
        }
        break;
    }

    return recommendations;
  }
}