import { SessionType, DataAccessLevel, ComplianceStatus } from '@prisma/client';
export declare class CreateDataAccessSessionDto {
    researchRequestId: string;
    userId: string;
    sessionType: SessionType;
    accessLevel: DataAccessLevel;
    purpose?: string;
    ipAddress?: string;
    userAgent?: string;
    approvalReference?: string;
    automatedMonitoring?: boolean;
}
export declare class UpdateDataAccessSessionDto {
    endTime?: string;
    duration?: number;
    dataAccessed?: string;
    queriesExecuted?: string;
    complianceStatus?: ComplianceStatus;
    violationReason?: string;
}
export declare class SearchDataAccessSessionDto {
    researchRequestId?: string;
    userId?: string;
    sessionType?: SessionType;
    accessLevel?: DataAccessLevel;
    complianceStatus?: ComplianceStatus;
    ipAddress?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}
export declare class AggregateDataQueryDto {
    cancerTypes?: string;
    years?: string;
    provinces?: string;
    ageGroups?: string;
    genders?: string;
    stages?: string;
    includeMortality?: boolean;
    includeSurvival?: boolean;
    includeTrends?: boolean;
    privacyThreshold?: number;
    groupBy?: string;
    aggregateFunction?: string;
    outputFormat?: string;
}
export declare class GeographicVisualizationDto {
    province?: string;
    regency?: string;
    cancerType?: string;
    year?: number;
    month?: number;
    metric?: string;
    mapType?: string;
    colorScheme?: string;
    showLabels?: boolean;
    privacyThreshold?: number;
    includeCoordinates?: boolean;
}
