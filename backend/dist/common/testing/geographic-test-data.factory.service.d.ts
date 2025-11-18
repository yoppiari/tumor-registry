export interface ProvinceData {
    id: string;
    name: string;
    code: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    population: number;
    healthFacilities: number;
}
export interface CancerData {
    id: string;
    provinceId: string;
    cancerType: string;
    cases: number;
    year: number;
    demographic: {
        ageGroup: string;
        gender: string;
    };
    coordinates?: {
        lat: number;
        lng: number;
    };
}
export interface AccuracyResult {
    isAccurate: boolean;
    errors: string[];
    accuracy: number;
    details: any;
}
export declare class GeographicTestDataFactory {
    private readonly logger;
    private readonly INDONESIAN_PROVINCES;
    private readonly CANCER_TYPES;
    createIndonesianProvinceData(): Promise<ProvinceData[]>;
    createCancerHotspotData(provinces: string[]): Promise<CancerData[]>;
    validateSpatialAccuracy(geographicData: any): Promise<AccuracyResult>;
    validateAggregationAccuracy(aggregatedData: any): Promise<AccuracyResult>;
    private validateCoordinates;
    private isWithinIndonesiaBounds;
    private generateDemographic;
}
