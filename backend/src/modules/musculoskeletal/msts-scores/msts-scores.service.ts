import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { CreateMstsScoreDto, UpdateMstsScoreDto } from './dto/msts-score.dto';

@Injectable()
export class MstsScoresService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateTotalScore(
    pain: number,
    func: number,
    emotionalAcceptance: number,
    supports: number,
    walking: number,
    gait: number,
  ): number {
    return pain + func + emotionalAcceptance + supports + walking + gait;
  }

  async create(createDto: CreateMstsScoreDto) {
    // Validate patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: createDto.patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${createDto.patientId} not found`);
    }

    // Calculate total score
    const totalScore = this.calculateTotalScore(
      createDto.pain,
      createDto.function,
      createDto.emotionalAcceptance,
      createDto.supports,
      createDto.walking,
      createDto.gait,
    );

    // Validate total score is within range (0-30)
    if (totalScore < 0 || totalScore > 30) {
      throw new BadRequestException('Total MSTS score must be between 0 and 30');
    }

    return this.prisma.mstsScore.create({
      data: {
        ...createDto,
        assessmentDate: new Date(createDto.assessmentDate),
        totalScore,
      },
    });
  }

  async findAll(patientId?: string) {
    const where: any = {};
    if (patientId) where.patientId = patientId;

    return this.prisma.mstsScore.findMany({
      where,
      orderBy: { assessmentDate: 'desc' },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            medicalRecordNumber: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const score = await this.prisma.mstsScore.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            medicalRecordNumber: true,
          },
        },
      },
    });

    if (!score) {
      throw new NotFoundException(`MSTS score with ID ${id} not found`);
    }

    return score;
  }

  async findByPatient(patientId: string) {
    return this.prisma.mstsScore.findMany({
      where: { patientId },
      orderBy: { assessmentDate: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateMstsScoreDto) {
    const existing = await this.findOne(id);

    // Recalculate total if any domain score changed
    const pain = updateDto.pain ?? existing.pain;
    const func = updateDto.function ?? existing.function;
    const emotionalAcceptance = updateDto.emotionalAcceptance ?? existing.emotionalAcceptance;
    const supports = updateDto.supports ?? existing.supports;
    const walking = updateDto.walking ?? existing.walking;
    const gait = updateDto.gait ?? existing.gait;

    const totalScore = this.calculateTotalScore(pain, func, emotionalAcceptance, supports, walking, gait);

    return this.prisma.mstsScore.update({
      where: { id },
      data: {
        ...updateDto,
        assessmentDate: updateDto.assessmentDate ? new Date(updateDto.assessmentDate) : undefined,
        totalScore,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    return this.prisma.mstsScore.delete({ where: { id } });
  }

  async getPatientScoreHistory(patientId: string) {
    const scores = await this.findByPatient(patientId);

    return {
      patientId,
      totalScores: scores.length,
      scores: scores.map(s => ({
        id: s.id,
        assessmentDate: s.assessmentDate,
        totalScore: s.totalScore,
        assessedBy: s.assessedBy,
      })),
      latestScore: scores[0] || null,
      averageScore: scores.length > 0
        ? scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length
        : null,
    };
  }
}
