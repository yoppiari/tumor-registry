import { ApprovalLevel, ApprovalStatus } from '@prisma/client';
export declare class CreateApprovalDto {
    researchRequestId: string;
    level: ApprovalLevel;
    status: ApprovalStatus;
    comments?: string;
    conditions?: string;
    isFinal?: boolean;
    delegationAllowed?: boolean;
    delegatedToId?: string;
}
export declare class UpdateApprovalDto {
    status?: ApprovalStatus;
    comments?: string;
    conditions?: string;
    isFinal?: boolean;
    delegationAllowed?: boolean;
    delegatedToId?: string;
}
