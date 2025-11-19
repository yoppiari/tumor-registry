import { StudyType, ResearchPriority, DataAccessLevel, CollaborationRole } from '@prisma/client';
export declare class CreateResearchRequestDto {
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
    collaborationDetails?: CreateCollaborationDto[];
}
export declare class CreateCollaborationDto {
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
export declare class UpdateResearchRequestDto {
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
