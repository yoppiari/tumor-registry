import { CentersService } from './centers.service';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';
export declare class CentersController {
    private readonly centersService;
    constructor(centersService: CentersService);
    create(createCenterDto: CreateCenterDto): Promise<import("./interfaces/center.interface").Center>;
    findAll(page: number, limit: number, city?: string, province?: string, type?: string, isActive?: boolean): Promise<{
        centers: import("./interfaces/center.interface").Center[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
        byType: Record<string, number>;
        byProvince: Record<string, number>;
        totalCapacity: number;
        averageCapacity: number;
    }>;
    findByCode(code: string): Promise<import("./interfaces/center.interface").Center>;
    findOne(id: string): Promise<import("./interfaces/center.interface").Center>;
    update(id: string, updateCenterDto: UpdateCenterDto): Promise<import("./interfaces/center.interface").Center>;
    activate(id: string): Promise<import("./interfaces/center.interface").Center>;
    deactivate(id: string): Promise<import("./interfaces/center.interface").Center>;
    remove(id: string): Promise<void>;
}
