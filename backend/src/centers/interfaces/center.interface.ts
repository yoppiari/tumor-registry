export interface Center {
  id: string;
  name: string;
  code: string;
  type: 'hospital' | 'clinic' | 'laboratory' | 'research_center';
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  capacity: number;
  isActive: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  specialties: string[];
  services: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCenterDto {
  name: string;
  code: string;
  type: 'hospital' | 'clinic' | 'laboratory' | 'research_center';
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  capacity: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  specialties: string[];
  services: string[];
}

export interface UpdateCenterDto {
  name?: string;
  type?: 'hospital' | 'clinic' | 'laboratory' | 'research_center';
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  specialties?: string[];
  services?: string[];
  isActive?: boolean;
}