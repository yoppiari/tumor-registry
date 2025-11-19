import { StudyType, ResearchPriority, DataAccessLevel, CollaborationRole } from '@prisma/client';
export declare class EnhancedCreateResearchRequestDto {
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
    expectedOutcomes?: string;
    riskAssessment?: string;
    dataRetentionPeriod?: number;
    priority?: ResearchPriority;
    collaborators?: string;
    contactEmail?: string;
    researchWebsite?: string;
    keywords?: string;
    collaborationDetails?: EnhancedCreateCollaborationDto[];
}
export declare class EnhancedCreateCollaborationDto {
    collaboratorId: string;
    role: CollaborationRole;
    responsibilities?: string;
    affiliation?: string;
    email?: string;
    phone?: string;
    expertise?: string;
    conflictOfInterest?: string;
    dataAccessLevel?: DataAccessLevel;
}
export declare class EnhancedUpdateResearchRequestDto {
    title?: string;
    description?: string;
    objectives?: string;
    methodology?: string;
    inclusionCriteria?: string;
    exclusionCriteria?: string;
    sampleSize?: number;
    duration?: number;
    expectedOutcomes?: string;
    riskAssessment?: string;
    dataRetentionPeriod?: number;
    notes?: string;
}
export declare class EnhancedSearchResearchDto {
    searchTerm?: string;
    status?: string;
    studyType?: StudyType;
    principalInvestigatorId?: string;
    centerId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
}
export declare class EnhancedApprovalDto {
    approvedBy: string;
    comments?: string;
    conditions?: string;
    ethicsNumber?: string;
}
