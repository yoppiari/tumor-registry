import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Center } from './interfaces/center.interface';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';

@Injectable()
export class CentersService {
  // Mock database - akan diganti dengan Prisma nanti
  private centers: Center[] = [
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

  async create(createCenterDto: CreateCenterDto): Promise<Center> {
    // Check if code already exists
    const existingCenter = this.centers.find(c => c.code === createCenterDto.code);
    if (existingCenter) {
      throw new ConflictException('Kode center sudah digunakan');
    }

    // Check if email already exists
    const existingEmail = this.centers.find(c => c.email === createCenterDto.email);
    if (existingEmail) {
      throw new ConflictException('Email center sudah digunakan');
    }

    const newCenter: Center = {
      id: `center-${Date.now()}`,
      ...createCenterDto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.centers.push(newCenter);
    return newCenter;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    city?: string,
    province?: string,
    type?: string,
    isActive?: boolean,
  ): Promise<{
    centers: Center[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let filteredCenters = [...this.centers];

    // Apply filters
    if (city) {
      filteredCenters = filteredCenters.filter(c =>
        c.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (province) {
      filteredCenters = filteredCenters.filter(c =>
        c.province.toLowerCase().includes(province.toLowerCase())
      );
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

  async findOne(id: string): Promise<Center> {
    const center = this.centers.find(c => c.id === id);

    if (!center) {
      throw new NotFoundException('Center tidak ditemukan');
    }

    return center;
  }

  async findByCode(code: string): Promise<Center> {
    const center = this.centers.find(c => c.code === code);

    if (!center) {
      throw new NotFoundException('Center dengan kode tersebut tidak ditemukan');
    }

    return center;
  }

  async update(id: string, updateCenterDto: UpdateCenterDto): Promise<Center> {
    const centerIndex = this.centers.findIndex(c => c.id === id);

    if (centerIndex === -1) {
      throw new NotFoundException('Center tidak ditemukan');
    }

    const center = this.centers[centerIndex];

    // Check if code conflicts with other centers
    if (updateCenterDto.code && updateCenterDto.code !== center.code) {
      const existingCenter = this.centers.find(c => c.code === updateCenterDto.code);
      if (existingCenter) {
        throw new ConflictException('Kode center sudah digunakan');
      }
    }

    // Check if email conflicts with other centers
    if (updateCenterDto.email && updateCenterDto.email !== center.email) {
      const existingEmail = this.centers.find(c => c.email === updateCenterDto.email);
      if (existingEmail) {
        throw new ConflictException('Email center sudah digunakan');
      }
    }

    // Update center
    const updatedCenter = {
      ...center,
      ...updateCenterDto,
      updatedAt: new Date(),
    };

    this.centers[centerIndex] = updatedCenter;
    return updatedCenter;
  }

  async remove(id: string): Promise<void> {
    const centerIndex = this.centers.findIndex(c => c.id === id);

    if (centerIndex === -1) {
      throw new NotFoundException('Center tidak ditemukan');
    }

    // Check if there are active users in this center (mock check)
    // In real implementation, this would check the users table
    if (centerIndex <= 1) { // Mock: prevent deletion of first 2 centers
      throw new BadRequestException('Tidak dapat menghapus center yang memiliki user aktif');
    }

    this.centers.splice(centerIndex, 1);
  }

  async activate(id: string): Promise<Center> {
    const center = await this.findOne(id);
    center.isActive = true;
    center.updatedAt = new Date();
    return center;
  }

  async deactivate(id: string): Promise<Center> {
    const center = await this.findOne(id);
    center.isActive = false;
    center.updatedAt = new Date();
    return center;
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
    byProvince: Record<string, number>;
    totalCapacity: number;
    averageCapacity: number;
  }> {
    const total = this.centers.length;
    const active = this.centers.filter(c => c.isActive).length;
    const inactive = total - active;

    const byType = this.centers.reduce((acc, center) => {
      acc[center.type] = (acc[center.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byProvince = this.centers.reduce((acc, center) => {
      acc[center.province] = (acc[center.province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

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
}