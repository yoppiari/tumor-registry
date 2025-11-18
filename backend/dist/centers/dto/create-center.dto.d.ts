export declare enum CenterType {
    HOSPITAL = "hospital",
    CLINIC = "clinic",
    LABORATORY = "laboratory",
    RESEARCH_CENTER = "research_center"
}
declare class CoordinatesDto {
    latitude: number;
    longitude: number;
}
export declare class CreateCenterDto {
    name: string;
    code: string;
    type: CenterType;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email: string;
    capacity: number;
    coordinates?: CoordinatesDto;
    specialties: string[];
    services: string[];
}
export {};
