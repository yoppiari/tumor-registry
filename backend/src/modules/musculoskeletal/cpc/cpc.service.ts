import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { CreateCpcConferenceDto, UpdateCpcConferenceDto } from './dto/cpc-conference.dto';

@Injectable()
export class CpcService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateCpcConferenceDto) {
    // Validate patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: createDto.patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient not found`);
    }

    return this.prisma.cpcConference.create({
      data: {
        ...createDto,
        conferenceDate: new Date(createDto.conferenceDate),
        consensus: createDto.consensus !== undefined ? createDto.consensus : true,
      },
    });
  }

  async findAll(patientId?: string, recommendationType?: string) {
    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (recommendationType) where.recommendationType = recommendationType;

    return this.prisma.cpcConference.findMany({
      where,
      orderBy: { conferenceDate: 'desc' },
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
    const conference = await this.prisma.cpcConference.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            medicalRecordNumber: true,
            dateOfBirth: true,
            gender: true,
          },
        },
      },
    });

    if (!conference) {
      throw new NotFoundException(`CPC conference not found`);
    }

    return conference;
  }

  async findByPatient(patientId: string) {
    return this.prisma.cpcConference.findMany({
      where: { patientId },
      orderBy: { conferenceDate: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateCpcConferenceDto) {
    await this.findOne(id); // Ensure exists

    return this.prisma.cpcConference.update({
      where: { id },
      data: {
        ...updateDto,
        conferenceDate: updateDto.conferenceDate ? new Date(updateDto.conferenceDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cpcConference.delete({ where: { id } });
  }

  async getPatientCpcSummary(patientId: string) {
    const conferences = await this.findByPatient(patientId);

    const summary = {
      patientId,
      totalConferences: conferences.length,
      byRecommendationType: {
        surgery: conferences.filter((c) => c.recommendationType === 'Surgery').length,
        chemotherapy: conferences.filter((c) => c.recommendationType === 'Chemotherapy').length,
        radiotherapy: conferences.filter((c) => c.recommendationType === 'Radiotherapy').length,
        combination: conferences.filter((c) => c.recommendationType === 'Combination').length,
        palliative: conferences.filter((c) => c.recommendationType === 'Palliative').length,
        watchAndWait: conferences.filter((c) => c.recommendationType === 'Watch and Wait').length,
      },
      consensusRate: conferences.length > 0
        ? (conferences.filter((c) => c.consensus).length / conferences.length) * 100
        : 0,
      dissentCases: conferences.filter((c) => !c.consensus || c.dissent).length,
      latestConference: conferences.length > 0 ? conferences[0] : null,
      recentConferences: conferences.slice(0, 5),
    };

    return summary;
  }

  async getRecentConferences(days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.prisma.cpcConference.findMany({
      where: {
        conferenceDate: {
          gte: since,
        },
      },
      orderBy: { conferenceDate: 'desc' },
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
}
