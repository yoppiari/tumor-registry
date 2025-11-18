"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PatientsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PatientsService = PatientsService_1 = class PatientsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PatientsService_1.name);
    }
    async findAll(centerId, includeInactive = false, page = 1, limit = 50, search) {
        try {
            const skip = (page - 1) * limit;
            const where = {
                ...(centerId && { centerId }),
                ...(includeInactive === false && { isActive: true }),
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { nik: { contains: search, mode: 'insensitive' } },
                        { medicalRecordNumber: { contains: search, mode: 'insensitive' } },
                        { phoneNumber: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            };
            const [patients, total] = await Promise.all([
                this.prisma.patient.findMany({
                    where,
                    include: {
                        center: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                        _count: {
                            select: {
                                diagnoses: {
                                    where: {
                                        status: 'ACTIVE',
                                    },
                                },
                                medications: {
                                    where: {
                                        isActive: true,
                                    },
                                },
                                visits: true,
                            },
                        },
                    },
                    orderBy: [
                        { name: 'asc' },
                    ],
                    skip,
                    take: limit,
                }),
                this.prisma.patient.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                patients: patients.map(patient => ({
                    ...patient,
                    activeDiagnoses: patient._count.diagnoses,
                    activeMedications: patient._count.medications,
                    totalVisits: patient._count.visits,
                    _count: undefined,
                })),
                total,
                page,
                totalPages,
            };
        }
        catch (error) {
            this.logger.error('Error finding all patients', error);
            throw error;
        }
    }
    async findById(id, includeMedicalHistory = false) {
        try {
            const patient = await this.prisma.patient.findUnique({
                where: { id },
                include: {
                    center: true,
                    ...(includeMedicalHistory && {
                        diagnoses: {
                            where: {
                                status: 'ACTIVE',
                            },
                            orderBy: {
                                createdAt: 'desc',
                            },
                        },
                        allergies: {
                            where: {
                                status: 'ACTIVE',
                            },
                            orderBy: {
                                createdAt: 'desc',
                            },
                        },
                        medications: {
                            where: {
                                isActive: true,
                            },
                            orderBy: {
                                createdAt: 'desc',
                            },
                        },
                        vitalSigns: {
                            orderBy: {
                                recordedAt: 'desc',
                            },
                            take: 10,
                        },
                        visits: {
                            orderBy: {
                                visitDate: 'desc',
                            },
                            take: 5,
                        },
                        insuranceInfos: {
                            where: {
                                isActive: true,
                            },
                        },
                    }),
                    _count: {
                        select: {
                            diagnoses: {
                                where: {
                                    status: 'ACTIVE',
                                },
                            },
                            medications: {
                                where: {
                                    isActive: true,
                                },
                            },
                            visits: true,
                            vitalSigns: true,
                        },
                    },
                },
            });
            if (!patient) {
                throw new common_1.NotFoundException(`Patient with ID ${id} not found`);
            }
            const age = this.calculateAge(patient.dateOfBirth, patient.dateOfDeath);
            return {
                ...patient,
                age,
                ageGroup: this.getAgeGroup(age),
                _count: undefined,
            };
        }
        catch (error) {
            this.logger.error(`Error finding patient by ID: ${id}`, error);
            throw error;
        }
    }
    async findByNIK(nik) {
        try {
            const patient = await this.prisma.patient.findUnique({
                where: { nik },
            });
            if (!patient) {
                throw new common_1.NotFoundException(`Patient with NIK ${nik} not found`);
            }
            return patient;
        }
        catch (error) {
            this.logger.error(`Error finding patient by NIK: ${nik}`, error);
            throw error;
        }
    }
    async findByMedicalRecordNumber(mrn) {
        try {
            const patient = await this.prisma.patient.findUnique({
                where: { medicalRecordNumber: mrn },
            });
            if (!patient) {
                throw new common_1.NotFoundException(`Patient with MRN ${mrn} not found`);
            }
            return patient;
        }
        catch (error) {
            this.logger.error(`Error finding patient by MRN: ${mrn}`, error);
            throw error;
        }
    }
    async create(patientData) {
        try {
            const existingPatientByNik = await this.prisma.patient.findUnique({
                where: { nik: patientData.nik },
            });
            if (existingPatientByNik) {
                throw new common_1.ConflictException(`Patient with NIK ${patientData.nik} already exists`);
            }
            const medicalRecordNumber = await this.generateMedicalRecordNumber(patientData.centerId);
            const patient = await this.prisma.patient.create({
                data: {
                    name: patientData.name,
                    nik: patientData.nik,
                    medicalRecordNumber,
                    dateOfBirth: patientData.dateOfBirth,
                    placeOfBirth: patientData.placeOfBirth,
                    gender: patientData.gender,
                    bloodType: patientData.bloodType,
                    religion: patientData.religion,
                    maritalStatus: patientData.maritalStatus,
                    occupation: patientData.occupation,
                    education: patientData.education,
                    phoneNumber: patientData.phoneNumber,
                    email: patientData.email,
                    address: patientData.address,
                    province: patientData.province,
                    regency: patientData.regency,
                    district: patientData.district,
                    village: patientData.village,
                    postalCode: patientData.postalCode,
                    emergencyContact: patientData.emergencyContact,
                    centerId: patientData.centerId,
                },
            });
            this.logger.log(`Patient created: ${patient.name} (${patient.medicalRecordNumber})`);
            return patient;
        }
        catch (error) {
            this.logger.error(`Error creating patient: ${patientData.name}`, error);
            throw error;
        }
    }
    async update(id, updateData) {
        try {
            const existingPatient = await this.findById(id);
            const updatedPatient = await this.prisma.patient.update({
                where: { id },
                data: {
                    ...(updateData.name && { name: updateData.name }),
                    ...(updateData.phoneNumber !== undefined && { phoneNumber: updateData.phoneNumber }),
                    ...(updateData.email !== undefined && { email: updateData.email }),
                    ...(updateData.address !== undefined && { address: updateData.address }),
                    ...(updateData.province && { province: updateData.province }),
                    ...(updateData.regency !== undefined && { regency: updateData.regency }),
                    ...(updateData.district !== undefined && { district: updateData.district }),
                    ...(updateData.village !== undefined && { village: updateData.village }),
                    ...(updateData.postalCode !== undefined && { postalCode: updateData.postalCode }),
                    ...(updateData.emergencyContact !== undefined && { emergencyContact: updateData.emergencyContact }),
                    ...(updateData.bloodType && { bloodType: updateData.bloodType }),
                    ...(updateData.religion !== undefined && { religion: updateData.religion }),
                    ...(updateData.maritalStatus && { maritalStatus: updateData.maritalStatus }),
                    ...(updateData.occupation !== undefined && { occupation: updateData.occupation }),
                    ...(updateData.education !== undefined && { education: updateData.education }),
                    ...(updateData.isActive !== undefined && { isActive: updateData.isActive }),
                    ...(updateData.isDeceased !== undefined && { isDeceased: updateData.isDeceased }),
                    ...(updateData.dateOfDeath !== undefined && { dateOfDeath: updateData.dateOfDeath }),
                    ...(updateData.causeOfDeath !== undefined && { causeOfDeath: updateData.causeOfDeath }),
                },
            });
            this.logger.log(`Patient updated: ${updatedPatient.name} (${updatedPatient.medicalRecordNumber})`);
            return updatedPatient;
        }
        catch (error) {
            this.logger.error(`Error updating patient with ID: ${id}`, error);
            throw error;
        }
    }
    async getPatientStatistics(centerId) {
        try {
            const where = centerId ? { centerId } : {};
            const [totalPatients, activePatients, deceasedPatients, genderStats, ageStats, bloodTypeStats,] = await Promise.all([
                this.prisma.patient.count({ where }),
                this.prisma.patient.count({
                    where: { ...where, isActive: true, isDeceased: false },
                }),
                this.prisma.patient.count({
                    where: { ...where, isDeceased: true },
                }),
                this.getGenderStatistics(where),
                this.getAgeStatistics(where),
                this.getBloodTypeStatistics(where),
            ]);
            return {
                totalPatients,
                activePatients,
                deceasedPatients,
                genderStats,
                ageStats,
                bloodTypeStats,
            };
        }
        catch (error) {
            this.logger.error('Error getting patient statistics', error);
            throw error;
        }
    }
    async searchPatients(query) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 50;
            const skip = (page - 1) * limit;
            const where = {
                ...(query.centerId && { centerId: query.centerId }),
                ...(query.gender && { gender: query.gender }),
                ...(query.bloodType && { bloodType: query.bloodType }),
                ...(query.maritalStatus && { maritalStatus: query.maritalStatus }),
                ...(query.isDeceased !== undefined && { isDeceased: query.isDeceased }),
                ...(query.dateOfBirthFrom || query.dateOfBirthTo ? {
                    dateOfBirth: {
                        ...(query.dateOfBirthFrom && { gte: query.dateOfBirthFrom }),
                        ...(query.dateOfBirthTo && { lte: query.dateOfBirthTo }),
                    },
                } : {}),
                ...(query.search && {
                    OR: [
                        { name: { contains: query.search, mode: 'insensitive' } },
                        { nik: { contains: query.search, mode: 'insensitive' } },
                        { medicalRecordNumber: { contains: query.search, mode: 'insensitive' } },
                        { phoneNumber: { contains: query.search, mode: 'insensitive' } },
                    ],
                }),
            };
            const [patients, total] = await Promise.all([
                this.prisma.patient.findMany({
                    where,
                    include: {
                        center: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                    orderBy: [
                        { name: 'asc' },
                    ],
                    skip,
                    take: limit,
                }),
                this.prisma.patient.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                patients: patients.map(patient => ({
                    ...patient,
                    age: this.calculateAge(patient.dateOfBirth, patient.dateOfDeath),
                })),
                total,
                page,
                totalPages,
            };
        }
        catch (error) {
            this.logger.error('Error searching patients', error);
            throw error;
        }
    }
    async generateMedicalRecordNumber(centerId) {
        try {
            const center = await this.prisma.center.findUnique({
                where: { id: centerId },
            });
            if (!center) {
                throw new common_1.NotFoundException('Center not found');
            }
            const currentYear = new Date().getFullYear();
            const prefix = `${center.code}${currentYear}`;
            const latestPatient = await this.prisma.patient.findMany({
                where: {
                    medicalRecordNumber: {
                        startsWith: prefix,
                    },
                },
                orderBy: {
                    medicalRecordNumber: 'desc',
                },
                take: 1,
            });
            let sequence = 1;
            if (latestPatient.length > 0) {
                const latestMRN = latestPatient[0].medicalRecordNumber;
                const latestSequence = parseInt(latestMRN.slice(-6));
                if (!isNaN(latestSequence)) {
                    sequence = latestSequence + 1;
                }
            }
            return `${prefix}${sequence.toString().padStart(6, '0')}`;
        }
        catch (error) {
            this.logger.error('Error generating medical record number', error);
            throw error;
        }
    }
    calculateAge(dateOfBirth, dateOfDeath) {
        const endDate = dateOfDeath || new Date();
        let age = endDate.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = endDate.getMonth() - dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        return age;
    }
    getAgeGroup(age) {
        if (age < 1)
            return 'Infant';
        if (age < 12)
            return 'Child';
        if (age < 18)
            return 'Adolescent';
        if (age < 40)
            return 'Adult';
        if (age < 60)
            return 'Middle-Aged';
        return 'Elderly';
    }
    async getGenderStatistics(where) {
        const stats = await this.prisma.patient.groupBy({
            by: ['gender'],
            where,
            _count: {
                gender: true,
            },
        });
        return stats.reduce((acc, stat) => {
            acc[stat.gender] = stat._count.gender;
            return acc;
        }, {});
    }
    async getAgeStatistics(where) {
        const patients = await this.prisma.patient.findMany({
            where,
            select: {
                dateOfBirth: true,
                dateOfDeath: true,
            },
        });
        const ageGroups = patients.reduce((acc, patient) => {
            const age = this.calculateAge(patient.dateOfBirth, patient.dateOfDeath);
            const group = this.getAgeGroup(age);
            acc[group] = (acc[group] || 0) + 1;
            return acc;
        }, {});
        return ageGroups;
    }
    async getBloodTypeStatistics(where) {
        const stats = await this.prisma.patient.groupBy({
            by: ['bloodType'],
            where: {
                ...where,
                bloodType: {
                    not: null,
                },
            },
            _count: {
                bloodType: true,
            },
        });
        return stats.reduce((acc, stat) => {
            acc[stat.bloodType] = stat._count.bloodType;
            return acc;
        }, {});
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = PatientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map