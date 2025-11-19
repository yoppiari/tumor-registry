import { ResearchRequestStatus, StudyType, EthicsStatus, ResearchPriority, CollaborationStatus, PublicationType, ImpactMetricType } from '@prisma/client';
export declare class SearchResearchRequestDto {
    search?: string;
    status?: ResearchRequestStatus;
    studyType?: StudyType;
    ethicsStatus?: EthicsStatus;
    priority?: ResearchPriority;
    principalInvestigatorId?: string;
    createdBy?: string;
    fundingSource?: string;
    province?: string;
    minSampleSize?: number;
    maxSampleSize?: number;
    minDuration?: number;
    maxDuration?: number;
    requiresEthicsApproval?: boolean;
    submittedAfter?: string;
    submittedBefore?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class SearchCollaborationDto {
    researchRequestId?: string;
    collaboratorId?: string;
    status?: CollaborationStatus;
    email?: string;
    affiliation?: string;
    page?: number;
    limit?: number;
}
export declare class SearchPublicationDto {
    researchRequestId?: string;
    search?: string;
    publicationType?: PublicationType;
    journal?: string;
    doi?: string;
    pmid?: string;
    openAccess?: boolean;
    year?: number;
    page?: number;
    limit?: number;
}
export declare class SearchImpactMetricDto {
    researchRequestId?: string;
    metricType?: ImpactMetricType;
    category?: string;
    isVerified?: boolean;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}
export declare class SearchGeographicDataDto {
    province?: string;
    regency?: string;
    cancerType?: string;
    stage?: string;
    year?: number;
    month?: number;
    gender?: string;
    ageGroup?: string;
    urbanRural?: string;
    minCount?: number;
    maxCount?: number;
    page?: number;
    limit?: number;
}
