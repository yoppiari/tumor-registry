export interface User {
  id: string;
  email: string;
  name: string;
  role: 'data_entry' | 'researcher' | 'admin' | 'national_stakeholder';
  centerId?: string;
  centerName?: string;
  isActive: boolean;
  emailVerified: boolean;
  phone?: string;
  avatar?: string;
  department?: string;
  licenseNumber?: string;
  specialization?: string[];
  bio?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'data_entry' | 'researcher' | 'admin' | 'national_stakeholder';
  centerId?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (userData: RegisterRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

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
  createdAt: string;
  updatedAt: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  department?: string;
  licenseNumber?: string;
  specialization?: string[];
  bio?: string;
}