export declare class CoordinatesResponseDto {
    latitude: number;
    longitude: number;
}
export declare class CenterResponseDto {
    id: string;
    name: string;
    code: string;
    type: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email: string;
    capacity: number;
    isActive: boolean;
    coordinates?: CoordinatesResponseDto;
    specialties: string[];
    services: string[];
    createdAt: Date;
    updatedAt: Date;
}
