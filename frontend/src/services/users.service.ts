import apiClient from './api.config';

// TypeScript interfaces matching backend response
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  nik?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  centerId?: string | null;
  center?: {
    id: string;
    name: string;
    code: string;
  } | null;
  userRoles: {
    id: string;
    roleId: string;
    isActive: boolean;
    role: {
      id: string;
      name: string;
      description?: string;
    };
  }[];
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  phone?: string;
  nik?: string;
  centerId?: string;
  roleId: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  nik?: string;
  centerId?: string;
  isActive?: boolean;
}

export interface ChangeRoleDto {
  roleId: string;
}

export interface ToggleStatusDto {
  isActive: boolean;
}

class UsersService {
  /**
   * Get all users
   */
  async fetchUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  }

  /**
   * Get user by ID
   */
  async fetchUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  }

  /**
   * Get users by center
   */
  async fetchUsersByCenter(centerId: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(`/users/center/${centerId}`);
    return response.data;
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Change user role
   */
  async changeUserRole(id: string, data: ChangeRoleDto): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/role`, data);
    return response.data;
  }

  /**
   * Toggle user status (activate/deactivate)
   */
  async toggleUserStatus(id: string, data: ToggleStatusDto): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/status`, data);
    return response.data;
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  /**
   * Activate user
   */
  async activateUser(id: string): Promise<User> {
    return this.toggleUserStatus(id, { isActive: true });
  }

  /**
   * Deactivate user
   */
  async deactivateUser(id: string): Promise<User> {
    return this.toggleUserStatus(id, { isActive: false });
  }
}

export default new UsersService();
