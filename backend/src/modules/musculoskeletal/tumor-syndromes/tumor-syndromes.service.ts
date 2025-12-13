import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { CreateTumorSyndromeDto } from './dto/tumor-syndrome.dto';

@Injectable()
export class TumorSyndromesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tumorSyndrome.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const syndrome = await this.prisma.tumorSyndrome.findUnique({ where: { id } });
    if (!syndrome) throw new NotFoundException(`Tumor syndrome not found`);
    return syndrome;
  }

  async create(dto: CreateTumorSyndromeDto) {
    return this.prisma.tumorSyndrome.create({ data: dto });
  }
}
