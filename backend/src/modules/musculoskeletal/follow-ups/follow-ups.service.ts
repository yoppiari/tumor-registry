import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import {
  CreateFollowUpVisitDto,
  UpdateFollowUpVisitDto,
  GenerateFollowUpScheduleDto,
} from './dto/follow-up-visit.dto';

@Injectable()
export class FollowUpsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate 14-visit follow-up schedule for a patient
   * Year 1-2: Every 3 months (8 visits)
   * Year 3-5: Every 6 months (6 visits)
   */
  async generateSchedule(dto: GenerateFollowUpScheduleDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient not found`);
    }

    // Check if schedule already exists
    const existing = await this.prisma.followUpVisit.count({
      where: { patientId: dto.patientId },
    });

    if (existing > 0) {
      throw new ConflictException(`Follow-up schedule already exists for this patient`);
    }

    const baseDate = new Date(dto.treatmentCompletionDate);
    const visits = [];

    // Year 1-2: Every 3 months (8 visits)
    for (let i = 1; i <= 8; i++) {
      const scheduledDate = new Date(baseDate);
      scheduledDate.setMonth(baseDate.getMonth() + i * 3);

      visits.push({
        patientId: dto.patientId,
        visitNumber: i,
        scheduledDate,
        visitType: '3-month',
        status: 'scheduled',
      });
    }

    // Year 3-5: Every 6 months (6 visits)
    for (let i = 1; i <= 6; i++) {
      const scheduledDate = new Date(baseDate);
      scheduledDate.setMonth(baseDate.getMonth() + 24 + i * 6); // Start after 24 months

      visits.push({
        patientId: dto.patientId,
        visitNumber: 8 + i,
        scheduledDate,
        visitType: '6-month',
        status: 'scheduled',
      });
    }

    // Create all visits
    const created = await this.prisma.followUpVisit.createMany({
      data: visits,
    });

    return {
      patientId: dto.patientId,
      totalVisits: created.count,
      message: `Generated ${created.count} follow-up visits for patient`,
    };
  }

  async create(createDto: CreateFollowUpVisitDto) {
    // Validate patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: createDto.patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient not found`);
    }

    // Check for duplicate visit number
    const existing = await this.prisma.followUpVisit.findUnique({
      where: {
        patientId_visitNumber: {
          patientId: createDto.patientId,
          visitNumber: createDto.visitNumber,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Visit number ${createDto.visitNumber} already exists for this patient`,
      );
    }

    return this.prisma.followUpVisit.create({
      data: {
        ...createDto,
        scheduledDate: new Date(createDto.scheduledDate),
        actualDate: createDto.actualDate ? new Date(createDto.actualDate) : undefined,
        status: createDto.status || 'scheduled',
      },
    });
  }

  async findAll(patientId?: string, status?: string) {
    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    return this.prisma.followUpVisit.findMany({
      where,
      orderBy: [{ patientId: 'asc' }, { visitNumber: 'asc' }],
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
    const visit = await this.prisma.followUpVisit.findUnique({
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

    if (!visit) {
      throw new NotFoundException(`Follow-up visit not found`);
    }

    return visit;
  }

  async findByPatient(patientId: string) {
    return this.prisma.followUpVisit.findMany({
      where: { patientId },
      orderBy: { visitNumber: 'asc' },
    });
  }

  async update(id: string, updateDto: UpdateFollowUpVisitDto) {
    await this.findOne(id); // Ensure exists

    return this.prisma.followUpVisit.update({
      where: { id },
      data: {
        ...updateDto,
        actualDate: updateDto.actualDate ? new Date(updateDto.actualDate) : undefined,
        nextVisitDate: updateDto.nextVisitDate ? new Date(updateDto.nextVisitDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.followUpVisit.delete({ where: { id } });
  }

  async getPatientFollowUpSummary(patientId: string) {
    const visits = await this.findByPatient(patientId);

    const summary = {
      patientId,
      totalVisits: visits.length,
      completed: visits.filter((v) => v.status === 'completed').length,
      scheduled: visits.filter((v) => v.status === 'scheduled').length,
      missed: visits.filter((v) => v.status === 'missed').length,
      cancelled: visits.filter((v) => v.status === 'cancelled').length,
      upcomingVisit: visits.find(
        (v) => v.status === 'scheduled' && v.scheduledDate > new Date(),
      ),
      lastCompletedVisit: visits
        .filter((v) => v.status === 'completed')
        .sort((a, b) => b.actualDate!.getTime() - a.actualDate!.getTime())[0],
      recurrence: {
        local: visits.some((v) => v.localRecurrence === true),
        distant: visits.some((v) => v.distantMetastasis === true),
      },
    };

    return summary;
  }
}
