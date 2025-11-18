import { CentersService } from './centers.service';
export declare class CentersController {
    private readonly centersService;
    constructor(centersService: CentersService);
    findAll(includeInactive?: string): Promise<Center[]>;
    getStatistics(): Promise<any>;
    findById(id: string, includeUsers?: string): Promise<any>;
    getCenterUsers(id: string): Promise<any[]>;
    create(createCenterDto: {
        name: string;
        code: string;
        province: string;
        regency?: string;
        address?: string;
    }): Promise<Center>;
    update(id: string, updateCenterDto: {
        name?: string;
        province?: string;
        regency?: string;
        address?: string;
        isActive?: boolean;
    }): Promise<Center>;
    activate(id: string): Promise<Center>;
    deactivate(id: string): Promise<Center>;
    delete(id: string): Promise<void>;
}
