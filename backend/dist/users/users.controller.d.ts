import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./interfaces/user.interface").UserProfile>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("./interfaces/user.interface").UserProfile>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<void>;
    deactivateAccount(req: any): Promise<void>;
    getUsersByCenter(centerId: string, page: number, limit: number): Promise<{
        users: import("./interfaces/user.interface").UserProfile[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
        emailVerified: number;
        byRole: Record<string, number>;
        byCenter: Record<string, number>;
    }>;
    getUserById(id: string): Promise<import("./interfaces/user.interface").UserProfile>;
}
