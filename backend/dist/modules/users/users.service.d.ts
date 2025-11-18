import { DatabaseService } from '../../database/database.service';
export declare class UsersService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    create(userData: any): Promise<any>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    update(id: string, updateData: any): Promise<any>;
    getUserRole(userId: string): Promise<any>;
    findAll(): Promise<any>;
    updateRole(userId: string, roleCode: string): Promise<any>;
}
