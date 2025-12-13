import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { CreateTreatmentDto, UpdateTreatmentDto } from './dto/treatment.dto';

@Injectable()
export class TreatmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateTreatmentDto) {
    // Validate patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: createDto.patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient not found`);
    }

    return this.prisma.treatmentManagement.create({
      data: {
        ...createDto,
        startDate: createDto.startDate ? new Date(createDto.startDate) : undefined,
        endDate: createDto.endDate ? new Date(createDto.endDate) : undefined,
        status: createDto.status || 'Planned',
      },
    });
  }

  async findAll(patientId?: string, treatmentType?: string, status?: string) {
    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (treatmentType) where.treatmentType = treatmentType;
    if (status) where.status = status;

    return this.prisma.treatmentManagement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
    const treatment = await this.prisma.treatmentManagement.findUnique({
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

    if (!treatment) {
      throw new NotFoundException(`Treatment not found`);
    }

    return treatment;
  }

  async findByPatient(patientId: string) {
    return this.prisma.treatmentManagement.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateTreatmentDto) {
    await this.findOne(id); // Ensure exists

    return this.prisma.treatmentManagement.update({
      where: { id },
      data: {
        ...updateDto,
        startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.treatmentManagement.delete({ where: { id } });
  }

  async getPatientTreatmentSummary(patientId: string) {
    const treatments = await this.findByPatient(patientId);

    const summary = {
      patientId,
      totalTreatments: treatments.length,
      byType: {
        surgery: treatments.filter((t) => t.treatmentType === 'Surgery').length,
        chemotherapy: treatments.filter((t) => t.treatmentType === 'Chemotherapy').length,
        radiotherapy: treatments.filter((t) => t.treatmentType === 'Radiotherapy').length,
        targetedTherapy: treatments.filter((t) => t.treatmentType === 'Targeted Therapy').length,
        immunotherapy: treatments.filter((t) => t.treatmentType === 'Immunotherapy').length,
      },
      byStatus: {
        planned: treatments.filter((t) => t.status === 'Planned').length,
        ongoing: treatments.filter((t) => t.status === 'Ongoing').length,
        completed: treatments.filter((t) => t.status === 'Completed').length,
        discontinued: treatments.filter((t) => t.status === 'Discontinued').length,
      },
      surgeryDetails: treatments
        .filter((t) => t.treatmentType === 'Surgery')
        .map((t) => ({
          id: t.id,
          surgeryType: t.surgeryType,
          surgicalMargin: t.surgicalMargin,
          reconstructionMethod: t.reconstructionMethod,
          status: t.status,
        })),
      activeChemotherapy: treatments.find(
        (t) => t.treatmentType === 'Chemotherapy' && t.status === 'Ongoing',
      ),
    };

    return summary;
  }
}
