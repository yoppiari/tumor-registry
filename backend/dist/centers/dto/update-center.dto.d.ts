import { CenterType } from './create-center.dto';
declare class CoordinatesDto {
    latitude: number;
    longitude: number;
}
export declare class UpdateCenterDto {
    name?: string;
    code?: string;
    type?: CenterType;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    capacity?: number;
    coordinates?: CoordinatesDto;
    specialties?: string[];
    services?: string[];
    isActive?: boolean;
}
export {};
