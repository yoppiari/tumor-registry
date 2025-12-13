import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';

@Injectable()
export class WhoClassificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== BONE TUMORS ====================

  async findAllBoneTumors(
    category?: string,
    subcategory?: string,
    isMalignant?: boolean,
    search?: string,
  ) {
    const where: any = { isActive: true };
    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (isMalignant !== undefined) where.isMalignant = isMalignant;
    if (search) {
      where.diagnosis = { contains: search, mode: 'insensitive' };
    }

    return this.prisma.whoBoneTumorClassification.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findBoneTumorById(id: string) {
    const tumor = await this.prisma.whoBoneTumorClassification.findUnique({
      where: { id },
    });
    if (!tumor) throw new NotFoundException(`Bone tumor classification not found`);
    return tumor;
  }

  async getBoneTumorCategories() {
    const categories = await this.prisma.whoBoneTumorClassification.groupBy({
      by: ['category'],
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });
    return categories.map((c) => c.category);
  }

  async getBoneTumorSubcategories(category?: string) {
    const where: any = { isActive: true };
    if (category) where.category = category;

    const subcategories = await this.prisma.whoBoneTumorClassification.groupBy({
      by: ['subcategory', 'category'],
      where,
      orderBy: { subcategory: 'asc' },
    });
    return subcategories;
  }

  // ==================== SOFT TISSUE TUMORS ====================

  async findAllSoftTissueTumors(
    category?: string,
    subcategory?: string,
    isMalignant?: boolean,
    search?: string,
  ) {
    const where: any = { isActive: true };
    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (isMalignant !== undefined) where.isMalignant = isMalignant;
    if (search) {
      where.diagnosis = { contains: search, mode: 'insensitive' };
    }

    return this.prisma.whoSoftTissueTumorClassification.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findSoftTissueTumorById(id: string) {
    const tumor = await this.prisma.whoSoftTissueTumorClassification.findUnique({
      where: { id },
    });
    if (!tumor) throw new NotFoundException(`Soft tissue tumor classification not found`);
    return tumor;
  }

  async getSoftTissueTumorCategories() {
    const categories = await this.prisma.whoSoftTissueTumorClassification.groupBy({
      by: ['category'],
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });
    return categories.map((c) => c.category);
  }

  async getSoftTissueTumorSubcategories(category?: string) {
    const where: any = { isActive: true };
    if (category) where.category = category;

    const subcategories = await this.prisma.whoSoftTissueTumorClassification.groupBy({
      by: ['subcategory', 'category'],
      where,
      orderBy: { subcategory: 'asc' },
    });
    return subcategories;
  }
}
