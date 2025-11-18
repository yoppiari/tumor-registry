import { Center } from './interfaces/center.interface';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';
export declare class CentersService {
    private centers;
    create(createCenterDto: CreateCenterDto): Promise<Center>;
    findAll(page?: number, limit?: number, city?: string, province?: string, type?: string, isActive?: boolean): Promise<{
        centers: Center[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Center>;
    findByCode(code: string): Promise<Center>;
    update(id: string, updateCenterDto: UpdateCenterDto): Promise<Center>;
    remove(id: string): Promise<void>;
    activate(id: string): Promise<Center>;
    deactivate(id: string): Promise<Center>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
        byType: Record<string, number>;
        byProvince: Record<string, number>;
        totalCapacity: number;
        averageCapacity: number;
    }>;
}
