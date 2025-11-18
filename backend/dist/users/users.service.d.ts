import { UserProfile, UpdateProfileDto, ChangePasswordDto } from './interfaces/user.interface';
export declare class UsersService {
    private users;
    private centers;
    getProfile(userId: string): Promise<UserProfile>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserProfile>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    deactivateAccount(userId: string): Promise<void>;
    updateLastLogin(userId: string): Promise<void>;
    getUsersByCenter(centerId: string, page?: number, limit?: number): Promise<{
        users: UserProfile[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
        emailVerified: number;
        byRole: Record<string, number>;
        byCenter: Record<string, number>;
    }>;
}
