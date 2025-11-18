import { ResearchService } from './research.service';
import { StudyType } from '@prisma/client';
export declare class ResearchController {
    private readonly researchService;
    constructor(researchService: ResearchService);
    createResearchRequest(createResearchRequestDto: {
        title: string;
        description: string;
        principalInvestigatorId: string;
        studyType: StudyType;
        objectives: string;
        methodology: string;
        inclusionCriteria: string;
        exclusionCriteria: string;
        sampleSize: number;
        duration: number;
        requiresEthicsApproval: boolean;
        dataRequested: string;
        confidentialityRequirements?: string;
        fundingSource?: string;
        collaborators?: string;
    }): Promise<any>;
    searchResearchRequests(searchQuery: any): Promise<{
        requests: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getResearchRequestById(requestId: string): Promise<any>;
    updateResearchRequest(requestId: string, updateData: {
        title?: string;
        description?: string;
        objectives?: string;
        methodology?: string;
        inclusionCriteria?: string;
        exclusionCriteria?: string;
        sampleSize?: number;
        duration?: number;
        dataRequested?: string;
        confidentialityRequirements?: string;
        fundingSource?: string;
        collaborators?: string;
    }): Promise<any>;
    approveResearchRequest(requestId: string, approvalData: {
        approvedBy: string;
        comments?: string;
    }): Promise<any>;
    rejectResearchRequest(requestId: string, rejectionData: {
        rejectionReason: string;
        reviewedBy: string;
    }): Promise<any>;
    requestEthicsReview(requestId: string): Promise<any>;
    approveEthics(requestId: string, ethicsData: {
        approvedBy: string;
        ethicsNumber?: string;
    }): Promise<any>;
    exportResearchData(requestId: string, exportData: {
        format: 'json' | 'csv' | 'excel';
        requestedBy: string;
    }): Promise<{
        exportId: any;
        requestId: string;
        format: "json" | "excel" | "csv";
        dataCount: number;
        status: string;
        exportDate: any;
    }>;
    getResearchStatistics(centerId?: string): Promise<any>;
    getPendingRequests(centerId?: string): Promise<{
        requests: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getMyRequests(principalInvestigatorId: string): Promise<{
        requests: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getEthicsPendingRequests(centerId?: string): Promise<{
        requests: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    createObservationalStudyRequest(studyData: {
        title: string;
        principalInvestigatorId: string;
        description: string;
        objectives: string;
        cancerType: string;
        sampleSize: number;
        duration: number;
        fundingSource?: string;
    }): Promise<any>;
    createClinicalOutcomeStudyRequest(outcomeData: {
        title: string;
        principalInvestigatorId: string;
        description: string;
        cancerType: string;
        treatmentType: string;
        objectives: string;
        sampleSize: number;
        duration: number;
        fundingSource?: string;
    }): Promise<any>;
    createRegistryBasedStudyRequest(registryData: {
        title: string;
        principalInvestigatorId: string;
        description: string;
        objectives: string;
        dataElements: string[];
        sampleSize: number;
        duration: number;
        fundingSource?: string;
    }): Promise<any>;
    createQualityImprovementStudyRequest(qualityData: {
        title: string;
        principalInvestigatorId: string;
        description: string;
        qualityMetrics: string[];
        baselineData: string;
        objectives: string;
        duration: number;
        fundingSource?: string;
    }): Promise<any>;
}
