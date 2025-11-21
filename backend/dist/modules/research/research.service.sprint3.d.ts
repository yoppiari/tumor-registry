import { PrismaService } from '@/common/database/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import { EmailService } from '../auth/email.service';
import { CollaborationStatus } from '@prisma/client';
export declare class ResearchSprint3Service {
    private prisma;
    private auditLogService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, auditLogService: AuditLogService, emailService: EmailService);
    createResearchRequest(requestData: any, userId: string): Promise<any>;
    getResearchRequests(searchDto: any, userId: string): Promise<{
        requests: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    getResearchRequestById(id: string, userId: string): Promise<any>;
    createApproval(approvalData: any, userId: string): Promise<any>;
    getApprovalsByResearchRequest(researchRequestId: string, userId: string): Promise<any>;
    createCollaboration(collaborationData: any, userId: string): Promise<any>;
    updateCollaborationStatus(id: string, status: CollaborationStatus, userId: string): Promise<any>;
    createDataAccessSession(sessionData: any, userId: string): Promise<any>;
    endDataAccessSession(id: string, endTime: Date, dataAccessed: any, queriesExecuted: any, userId: string): Promise<any>;
    getAggregateStatistics(queryDto: any, userId: string): Promise<{
        data: any;
        metadata: {
            queryParameters: any;
            privacyThreshold: any;
            totalRecords: any;
            generatedAt: Date;
        };
    }>;
    getGeographicData(geoDto: any, userId: string): Promise<{
        data: any;
        metadata: {
            queryParameters: any;
            privacyThreshold: any;
            totalRecords: any;
            filteredRecords: any;
            generatedAt: Date;
        };
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    createImpactMetric(metricData: any, userId: string): Promise<any>;
    private initializeApprovalWorkflow;
    private determineRequiredApprovalLevels;
    private checkApprovalPermission;
    private checkResearchRequestAccess;
    private validateDataAccessPermission;
    private checkAggregateDataAccess;
    private checkGeographicDataAccess;
    private checkUserPermission;
    private isAdmin;
    private buildAggregateQuery;
    private executeAggregateQuery;
    private performComplianceCheck;
    private handleComplianceViolation;
    private updateResearchRequestStatusAfterApproval;
    private notifyNewResearchRequest;
    private notifyApprovalUpdate;
    private sendCollaborationInvitation;
    private notifyCollaborationStatusUpdate;
    updateResearchRequest(id: string, updateData: any, userId: string): Promise<any>;
    updateApproval(id: string, updateData: any, userId: string): Promise<any>;
    getMyApprovals(query: any, userId: string): Promise<any>;
    getCollaborations(researchRequestId: string, searchDto: any, userId: string): Promise<{
        collaborations: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    getMyCollaborations(query: any, userId: string): Promise<any>;
    getDataAccessSessions(searchDto: any, userId: string): Promise<{
        sessions: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    getMyDataAccessSessions(query: any, userId: string): Promise<any>;
    createPublication(publicationData: any, userId: string): Promise<any>;
    getPublications(researchRequestId: string, searchDto: any, userId: string): Promise<{
        publications: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    getDashboardOverview(userId: string): Promise<{
        overview: {
            totalRequests: any;
            pendingRequests: any;
            approvedRequests: any;
            myRequests: any;
            myApprovals: any;
            activeCollaborations: any;
            recentPublications: any;
        };
    }>;
    getWorkflowAnalytics(query: any, userId: string): Promise<{
        dateRange: any;
        requestsByStatus: any;
        requestsByType: any;
        averageApprovalTime: any;
        complianceRate: any;
    }>;
    getComplianceAnalytics(query: any, userId: string): Promise<{
        dateRange: any;
        totalSessions: any;
        violationCount: any;
        complianceRate: number;
        sessionsByStatus: any;
    }>;
    getResearchStats(userId: string): Promise<{
        totalThisYear: any;
        statusBreakdown: any;
    }>;
    exportCleanData(query: any, res: any, userId: string): Promise<void>;
    private getAverageApprovalTime;
    private getComplianceRate;
    private getContentType;
}
