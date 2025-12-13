import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { CreatePathologyTypeDto, UpdatePathologyTypeDto } from './dto/pathology-type.dto';

@Injectable()
export class PathologyTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pathologyType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const pathologyType = await this.prisma.pathologyType.findUnique({
      where: { id },
    });

    if (!pathologyType) {
      throw new NotFoundException(`Pathology type with ID ${id} not found`);
    }

    return pathologyType;
  }

  async findByCode(code: string) {
    const pathologyType = await this.prisma.pathologyType.findUnique({
      where: { code },
    });

    if (!pathologyType) {
      throw new NotFoundException(`Pathology type with code ${code} not found`);
    }

    return pathologyType;
  }

  async create(createDto: CreatePathologyTypeDto) {
    return this.prisma.pathologyType.create({
      data: {
        ...createDto,
        sortOrder: createDto.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, updateDto: UpdatePathologyTypeDto) {
    await this.findOne(id); // Ensure exists

    return this.prisma.pathologyType.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists

    return this.prisma.pathologyType.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
