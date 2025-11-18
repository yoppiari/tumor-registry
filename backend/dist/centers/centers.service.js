"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CentersService = void 0;
const common_1 = require("@nestjs/common");
let CentersService = class CentersService {
    constructor() {
        this.centers = [
            {
                id: 'center-001',
                name: 'Rumah Sakit Kanker Dharmais',
                code: 'RSCM-DH',
                type: 'hospital',
                address: 'Jl. Letjen S. Parman Kav. 84-86',
                city: 'Jakarta Barat',
                province: 'DKI Jakarta',
                postalCode: '11420',
                phone: '+62215680800',
                email: 'info@dharmaishospital.co.id',
                capacity: 200,
                isActive: true,
                coordinates: {
                    latitude: -6.1809,
                    longitude: 106.7957,
                },
                specialties: ['Onkologi', 'Radioterapi', 'Kemoterapi', 'Bedah Onkologi'],
                services: ['Diagnosis', 'Pengobatan', 'Rehabilitasi', 'Konsultasi'],
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            },
            {
                id: 'center-002',
                name: 'Rumah Sakit Cipto Mangunkusumo',
                code: 'RSCM',
                type: 'hospital',
                address: 'Jl. Diponegoro No. 71',
                city: 'Jakarta Pusat',
                province: 'DKI Jakarta',
                postalCode: '10430',
                phone: '+622131930000',
                email: 'info@rscm.co.id',
                capacity: 800,
                isActive: true,
                coordinates: {
                    latitude: -6.1914,
                    longitude: 106.8426,
                },
                specialties: ['Onkologi', 'Hematologi', 'Patologi Anatomi', 'Radiologi'],
                services: ['Diagnosis', 'Pengobatan', 'Riset', 'Pendidikan'],
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            },
        ];
    }
    async create(createCenterDto) {
        const existingCenter = this.centers.find(c => c.code === createCenterDto.code);
        if (existingCenter) {
            throw new common_1.ConflictException('Kode center sudah digunakan');
        }
        const existingEmail = this.centers.find(c => c.email === createCenterDto.email);
        if (existingEmail) {
            throw new common_1.ConflictException('Email center sudah digunakan');
        }
        const newCenter = {
            id: `center-${Date.now()}`,
            ...createCenterDto,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.centers.push(newCenter);
        return newCenter;
    }
    async findAll(page = 1, limit = 10, city, province, type, isActive) {
        let filteredCenters = [...this.centers];
        if (city) {
            filteredCenters = filteredCenters.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
        }
        if (province) {
            filteredCenters = filteredCenters.filter(c => c.province.toLowerCase().includes(province.toLowerCase()));
        }
        if (type) {
            filteredCenters = filteredCenters.filter(c => c.type === type);
        }
        if (typeof isActive === 'boolean') {
            filteredCenters = filteredCenters.filter(c => c.isActive === isActive);
        }
        const total = filteredCenters.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedCenters = filteredCenters.slice(startIndex, endIndex);
        return {
            centers: paginatedCenters,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async findOne(id) {
        const center = this.centers.find(c => c.id === id);
        if (!center) {
            throw new common_1.NotFoundException('Center tidak ditemukan');
        }
        return center;
    }
    async findByCode(code) {
        const center = this.centers.find(c => c.code === code);
        if (!center) {
            throw new common_1.NotFoundException('Center dengan kode tersebut tidak ditemukan');
        }
        return center;
    }
    async update(id, updateCenterDto) {
        const centerIndex = this.centers.findIndex(c => c.id === id);
        if (centerIndex === -1) {
            throw new common_1.NotFoundException('Center tidak ditemukan');
        }
        const center = this.centers[centerIndex];
        if (updateCenterDto.code && updateCenterDto.code !== center.code) {
            const existingCenter = this.centers.find(c => c.code === updateCenterDto.code);
            if (existingCenter) {
                throw new common_1.ConflictException('Kode center sudah digunakan');
            }
        }
        if (updateCenterDto.email && updateCenterDto.email !== center.email) {
            const existingEmail = this.centers.find(c => c.email === updateCenterDto.email);
            if (existingEmail) {
                throw new common_1.ConflictException('Email center sudah digunakan');
            }
        }
        const updatedCenter = {
            ...center,
            ...updateCenterDto,
            updatedAt: new Date(),
        };
        this.centers[centerIndex] = updatedCenter;
        return updatedCenter;
    }
    async remove(id) {
        const centerIndex = this.centers.findIndex(c => c.id === id);
        if (centerIndex === -1) {
            throw new common_1.NotFoundException('Center tidak ditemukan');
        }
        if (centerIndex <= 1) {
            throw new common_1.BadRequestException('Tidak dapat menghapus center yang memiliki user aktif');
        }
        this.centers.splice(centerIndex, 1);
    }
    async activate(id) {
        const center = await this.findOne(id);
        center.isActive = true;
        center.updatedAt = new Date();
        return center;
    }
    async deactivate(id) {
        const center = await this.findOne(id);
        center.isActive = false;
        center.updatedAt = new Date();
        return center;
    }
    async getStatistics() {
        const total = this.centers.length;
        const active = this.centers.filter(c => c.isActive).length;
        const inactive = total - active;
        const byType = this.centers.reduce((acc, center) => {
            acc[center.type] = (acc[center.type] || 0) + 1;
            return acc;
        }, {});
        const byProvince = this.centers.reduce((acc, center) => {
            acc[center.province] = (acc[center.province] || 0) + 1;
            return acc;
        }, {});
        const totalCapacity = this.centers.reduce((sum, center) => sum + center.capacity, 0);
        const averageCapacity = total > 0 ? Math.round(totalCapacity / total) : 0;
        return {
            total,
            active,
            inactive,
            byType,
            byProvince,
            totalCapacity,
            averageCapacity,
        };
    }
};
exports.CentersService = CentersService;
exports.CentersService = CentersService = __decorate([
    (0, common_1.Injectable)()
], CentersService);
//# sourceMappingURL=centers.service.js.map