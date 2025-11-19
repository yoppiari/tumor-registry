import { ResearchSprint3Service } from './research.service.sprint3';
import { CreateResearchRequestDto, UpdateResearchRequestDto, CreateCollaborationDto } from './dto/create-research-request.dto';
import { CreateApprovalDto, UpdateApprovalDto } from './dto/create-approval.dto';
import { SearchResearchRequestDto, SearchCollaborationDto, SearchPublicationDto, SearchImpactMetricDto } from './dto/search-research.dto';
import { CreateDataAccessSessionDto, SearchDataAccessSessionDto, AggregateDataQueryDto, GeographicVisualizationDto } from './dto/data-access.dto';
import { CollaborationStatus } from '@prisma/client';
export declare class ResearchSprint3Controller {
    private readonly researchService;
    constructor(researchService: ResearchSprint3Service);
    getAggregateStatistics(queryDto: AggregateDataQueryDto, req: any): Promise<{
        data: any;
        metadata: {
            queryParameters: any;
            privacyThreshold: any;
            totalRecords: any;
            generatedAt: Date;
        };
    }>;
    getCancerTrends(query: any, req: any): Promise<{
        data: any;
        metadata: {
            queryParameters: any;
            privacyThreshold: any;
            totalRecords: any;
            generatedAt: Date;
        };
    }>;
    getDemographicAnalysis(query: any, req: any): Promise<{
        data: any;
        metadata: {
            queryParameters: any;
            privacyThreshold: any;
            totalRecords: any;
            generatedAt: Date;
        };
    }>;
    getGeographicData(geoDto: GeographicVisualizationDto, req: any): Promise<{
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
    getCancerHotspots(query: any, req: any): Promise<{
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
    getProvincialStatistics(query: any, req: any): Promise<{
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
    createResearchRequest(createResearchRequestDto: CreateResearchRequestDto, req: any): Promise<any>;
    getResearchRequests(searchDto: SearchResearchRequestDto, req: any): Promise<{
        requests: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    getResearchRequestById(id: string, req: any): Promise<any>;
    updateResearchRequest(id: string, updateResearchRequestDto: UpdateResearchRequestDto, req: any): Promise<any>;
    createApproval(createApprovalDto: CreateApprovalDto, req: any): Promise<any>;
    getApprovalsByResearchRequest(id: string, req: any): Promise<any>;
    updateApproval(id: string, updateApprovalDto: UpdateApprovalDto, req: any): Promise<any>;
    getMyApprovals(query: any, req: any): Promise<any>;
    createCollaboration(createCollaborationDto: CreateCollaborationDto, req: any): Promise<any>;
    updateCollaborationStatus(id: string, status: CollaborationStatus, req: any): Promise<any>;
    getCollaborations(id: string, searchDto: SearchCollaborationDto, req: any): Promise<{
        collaborations: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    getMyCollaborations(query: any, req: any): Promise<any>;
    createDataAccessSession(createSessionDto: CreateDataAccessSessionDto, req: any): Promise<any>;
    endDataAccessSession(id: string, updateData: {
        dataAccessed: any;
        queriesExecuted: any;
    }, req: any): Promise<any>;
    getDataAccessSessions(searchDto: SearchDataAccessSessionDto, req: any): Promise<{
        sessions: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    getMyDataAccessSessions(query: any, req: any): Promise<any>;
    createImpactMetric(metricData: any, req: any): Promise<any>;
    getImpactMetrics(id: string, searchDto: SearchImpactMetricDto, req: any): Promise<{
        metrics: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    createPublication(publicationData: any, req: any): Promise<any>;
    getPublications(id: string, searchDto: SearchPublicationDto, req: any): Promise<{
        publications: any;
        pagination: {
            page: any;
            limit: any;
            total: any;
            totalPages: number;
        };
    }>;
    getDashboardOverview(req: any): Promise<{
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
    getWorkflowAnalytics(query: any, req: any): Promise<{
        dateRange: any;
        requestsByStatus: any;
        requestsByType: any;
        averageApprovalTime: any;
        complianceRate: any;
    }>;
    getComplianceAnalytics(query: any, req: any): Promise<{
        dateRange: any;
        totalSessions: any;
        violationCount: any;
        complianceRate: number;
        sessionsByStatus: any;
    }>;
    getResearchStats(req: any): Promise<{
        totalThisYear: any;
        statusBreakdown: any;
    }>;
    exportCleanData(query: any, req: any, res: any): Promise<void>;
    validateResearchRequest(requestData: any, req: any): Promise<void>;
}
