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
var ExternalSystemsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalSystemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ExternalSystemsService = ExternalSystemsService_1 = class ExternalSystemsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ExternalSystemsService_1.name);
    }
    async processHL7Message(message) {
        try {
            this.logger.log('Processing HL7 message');
            const parsedMessage = this.parseHL7Message(message);
            switch (parsedMessage.messageType) {
                case 'ADT_A01':
                    return await this.processADTMessage(parsedMessage, 'admission');
                case 'ADT_A02':
                    return await this.processADTMessage(parsedMessage, 'transfer');
                case 'ADT_A03':
                    return await this.processADTMessage(parsedMessage, 'discharge');
                case 'ORM_O01':
                    return await this.processORMMessage(parsedMessage);
                case 'ORU_R01':
                    return await this.processORUMessage(parsedMessage);
                default:
                    throw new Error(`Unsupported HL7 message type: ${parsedMessage.messageType}`);
            }
        }
        catch (error) {
            this.logger.error('Error processing HL7 message', error);
            throw error;
        }
    }
    async processDICOMImage(imageData) {
        try {
            this.logger.log('Processing DICOM image');
            const metadata = this.extractDICOMMetadata(imageData);
            const imageRecord = await this.storeDICOMImage(imageData, metadata);
            await this.updateMedicalRecordsWithDICOM(imageRecord, metadata);
            return {
                imageId: imageRecord.id,
                patientId: metadata.patientId,
                studyInstanceUID: metadata.studyInstanceUID,
                seriesInstanceUID: metadata.seriesInstanceUID,
                sopInstanceUID: metadata.sopInstanceUID,
                modality: metadata.modality,
                processedAt: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Error processing DICOM image', error);
            throw error;
        }
    }
    async integrateWithEMR(emrData) {
        try {
            this.logger.log(`Integrating with EMR system: ${emrData.systemType}`);
            const connection = await this.establishEMRConnection(emrData);
            const data = await this.fetchEMRData(connection, emrData.syncType, emrData.lastSyncDate);
            const importResult = await this.importEMRData(data, emrData.systemType);
            await this.logIntegration('EMR', emrData.systemType, importResult);
            return {
                integrationId: `emr_${Date.now()}`,
                systemType: emrData.systemType,
                recordsProcessed: importResult.processed,
                recordsCreated: importResult.created,
                recordsUpdated: importResult.updated,
                errors: importResult.errors,
                syncDate: new Date(),
                nextSyncDate: this.calculateNextSyncDate(emrData.syncType),
            };
        }
        catch (error) {
            this.logger.error('Error integrating with EMR system', error);
            throw error;
        }
    }
    async syncWithLaboratorySystem(labConfig) {
        try {
            this.logger.log(`Syncing with laboratory system: ${labConfig.systemName}`);
            const authResult = await this.authenticateWithLabSystem(labConfig);
            const results = await this.fetchLabResults(labConfig, authResult.token);
            const processedResults = await this.processLabResults(results);
            await this.updatePatientLabRecords(processedResults);
            return {
                syncId: `lab_sync_${Date.now()}`,
                systemName: labConfig.systemName,
                resultsProcessed: processedResults.length,
                successfulUpdates: processedResults.filter(r => r.success).length,
                failedUpdates: processedResults.filter(r => !r.success).length,
                nextSync: new Date(Date.now() + labConfig.syncFrequency * 60 * 60 * 1000),
            };
        }
        catch (error) {
            this.logger.error('Error syncing with laboratory system', error);
            throw error;
        }
    }
    async integrateWithPharmacySystem(pharmacyConfig) {
        try {
            this.logger.log(`Integrating with pharmacy system: ${pharmacyConfig.systemName}`);
            const results = {
                medicationSync: null,
                orderSync: null,
            };
            if (pharmacyConfig.medicationSync) {
                results.medicationSync = await this.syncMedicationData(pharmacyConfig);
            }
            if (pharmacyConfig.orderSync) {
                results.orderSync = await this.syncMedicationOrders(pharmacyConfig);
            }
            return {
                integrationId: `pharmacy_${Date.now()}`,
                systemName: pharmacyConfig.systemName,
                results,
                timestamp: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Error integrating with pharmacy system', error);
            throw error;
        }
    }
    async createFHIRResource(resourceType, data) {
        try {
            this.logger.log(`Creating FHIR resource: ${resourceType}`);
            const validationResult = await this.validateFHIRResource(resourceType, data);
            if (!validationResult.valid) {
                throw new Error(`Invalid FHIR resource: ${validationResult.errors.join(', ')}`);
            }
            const internalData = await this.transformFHIRToInternal(resourceType, data);
            const storedResource = await this.storeFHIRResource(resourceType, internalData);
            return {
                resourceId: storedResource.id,
                resourceType,
                fhirId: data.id || storedResource.id,
                version: storedResource.version,
                lastModified: storedResource.updatedAt,
                created: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Error creating FHIR resource', error);
            throw error;
        }
    }
    async getIntegrationStatus() {
        try {
            const integrations = await this.prisma.externalSystem.findMany({
                where: { isActive: true },
                include: {
                    integrationLogs: {
                        orderBy: { timestamp: 'desc' },
                        take: 5,
                    },
                },
            });
            const status = integrations.map(integration => ({
                systemId: integration.id,
                systemName: integration.name,
                systemType: integration.type,
                status: this.checkSystemHealth(integration),
                lastSync: integration.lastSyncDate,
                lastSyncStatus: this.getLastSyncStatus(integration),
                uptime: this.calculateUptime(integration),
                errorRate: this.calculateErrorRate(integration),
                nextScheduledSync: integration.nextSyncDate,
            }));
            return {
                totalSystems: integrations.length,
                activeSystems: status.filter(s => s.status === 'healthy').length,
                systemsNeedingAttention: status.filter(s => s.status !== 'healthy'),
                details: status,
                summary: {
                    overallHealth: this.calculateOverallHealth(status),
                    lastHourActivity: await this.getRecentActivity(),
                },
            };
        }
        catch (error) {
            this.logger.error('Error getting integration status', error);
            throw error;
        }
    }
    parseHL7Message(message) {
        const segments = message.split('\r').filter(segment => segment.length > 0);
        const mshSegment = segments.find(seg => seg.startsWith('MSH'));
        if (!mshSegment) {
            throw new Error('Invalid HL7 message: MSH segment not found');
        }
        const mshFields = mshSegment.split('|');
        return {
            messageType: mshFields[8] ? mshFields[8].substring(0, mshFields[8].indexOf('^')) : 'UNKNOWN',
            timestamp: mshFields[6] ? this.parseHL7Timestamp(mshFields[6]) : new Date(),
            sendingFacility: mshFields[3] || '',
            sendingApplication: mshFields[2] || '',
            segments: segments,
        };
    }
    async processADTMessage(message, actionType) {
        const patientSegment = message.segments.find(seg => seg.startsWith('PID'));
        const pv1Segment = message.segments.find(seg => seg.startsWith('PV1'));
        if (!patientSegment) {
            throw new Error('ADT message missing PID segment');
        }
        const patientData = this.parsePIDSegment(patientSegment);
        const locationData = pv1Segment ? this.parsePV1Segment(pv1Segment) : null;
        let result;
        switch (actionType) {
            case 'admission':
                result = await this.processPatientAdmission(patientData, locationData);
                break;
            case 'transfer':
                result = await this.processPatientTransfer(patientData, locationData);
                break;
            case 'discharge':
                result = await this.processPatientDischarge(patientData, locationData);
                break;
        }
        return {
            messageType: `ADT_${actionType.toUpperCase()}`,
            patientId: patientData.id,
            action: actionType,
            processedAt: new Date(),
            result,
        };
    }
    async processORMMessage(message) {
        const orcSegment = message.segments.find(seg => seg.startsWith('ORC'));
        const obrSegment = message.segments.find(seg => seg.startsWith('OBR'));
        if (!orcSegment) {
            throw new Error('ORM message missing ORC segment');
        }
        const orderData = this.parseORCSegment(orcSegment);
        const observationData = obrSegment ? this.parseOBRSegment(obrSegment) : null;
        return await this.processOrderMessage(orderData, observationData);
    }
    async processORUMessage(message) {
        const obrSegment = message.segments.find(seg => seg.startsWith('OBR'));
        const obxSegments = message.segments.filter(seg => seg.startsWith('OBX'));
        if (!obrSegment) {
            throw new Error('ORU message missing OBR segment');
        }
        const observationRequest = this.parseOBRSegment(obrSegment);
        const results = obxSegments.map(seg => this.parseOBXSegment(seg));
        return await this.processLabResultMessage(observationRequest, results);
    }
    extractDICOMMetadata(imageData) {
        return {
            patientId: imageData.patientID || 'UNKNOWN',
            patientName: imageData.patientName || 'Unknown Patient',
            studyInstanceUID: imageData.studyInstanceUID,
            seriesInstanceUID: imageData.seriesInstanceUID,
            sopInstanceUID: imageData.sopInstanceUID,
            modality: imageData.modality || 'UNKNOWN',
            studyDate: imageData.studyDate || new Date(),
            bodyPart: imageData.bodyPartExamined || 'UNKNOWN',
            institutionName: imageData.institutionName || 'Unknown Institution',
        };
    }
    async storeDICOMImage(imageData, metadata) {
        return await this.prisma.dicomImage.create({
            data: {
                patientId: metadata.patientId,
                patientName: metadata.patientName,
                studyInstanceUID: metadata.studyInstanceUID,
                seriesInstanceUID: metadata.seriesInstanceUID,
                sopInstanceUID: metadata.sopInstanceUID,
                modality: metadata.modality,
                studyDate: metadata.studyDate,
                bodyPart: metadata.bodyPart,
                institutionName: metadata.institutionName,
                imagePath: `/dicom/${metadata.sopInstanceUID}.dcm`,
                metadata: metadata,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
    async updateMedicalRecordsWithDICOM(imageRecord, metadata) {
        await this.prisma.medicalRecord.updateMany({
            where: { patientId: metadata.patientId },
            data: {
                imagingStudies: {
                    push: {
                        studyInstanceUID: metadata.studyInstanceUID,
                        modality: metadata.modality,
                        studyDate: metadata.studyDate,
                        bodyPart: metadata.bodyPart,
                        imageCount: 1,
                    },
                },
                updatedAt: new Date(),
            },
        });
    }
    parseHL7Timestamp(timestamp) {
        const year = parseInt(timestamp.substring(0, 4));
        const month = parseInt(timestamp.substring(4, 6)) - 1;
        const day = parseInt(timestamp.substring(6, 8));
        const hour = parseInt(timestamp.substring(8, 10));
        const minute = parseInt(timestamp.substring(10, 12));
        const second = parseInt(timestamp.substring(12, 14));
        return new Date(year, month, day, hour, minute, second);
    }
    parsePIDSegment(pidSegment) {
        const fields = pidSegment.split('|');
        return {
            id: fields[4] || 'UNKNOWN',
            name: fields[5] || 'Unknown',
            dateOfBirth: fields[7] ? this.parseHL7Timestamp(fields[7]) : null,
            gender: fields[8] || 'U',
        };
    }
    parsePV1Segment(pv1Segment) {
        const fields = pv1Segment.split('|');
        return {
            patientClass: fields[2] || 'UNKNOWN',
            assignedLocation: fields[3] || '',
            admissionType: fields[2] || '',
        };
    }
    parseORCSegment(orcSegment) {
        const fields = orcSegment.split('|');
        return {
            orderControl: fields[1] || '',
            placerOrderNumber: fields[2] || '',
            fillerOrderNumber: fields[3] || '',
            orderStatus: fields[5] || '',
        };
    }
    parseOBRSegment(obrSegment) {
        const fields = obrSegment.split('|');
        return {
            placerOrderNumber: fields[2] || '',
            fillerOrderNumber: fields[3] || '',
            universalServiceId: fields[4] || '',
            observationDateTime: fields[7] ? this.parseHL7Timestamp(fields[7]) : new Date(),
        };
    }
    parseOBXSegment(obxSegment) {
        const fields = obxSegment.split('|');
        return {
            setID: fields[1] || '',
            observationIdentifier: fields[3] || '',
            observationValue: fields[5] || '',
            units: fields[6] || '',
            referenceRange: fields[7] || '',
            abnormalFlag: fields[8] || '',
        };
    }
    async establishEMRConnection(config) {
        return { token: 'mock_token', endpoint: config.endpoint };
    }
    async fetchEMRData(connection, syncType, lastSyncDate) {
        return { patients: [], encounters: [], orders: [] };
    }
    async importEMRData(data, systemType) {
        return { processed: 0, created: 0, updated: 0, errors: [] };
    }
    async logIntegration(system, systemType, result) {
    }
    calculateNextSyncDate(syncType) {
        const hours = syncType === 'full' ? 24 : 1;
        return new Date(Date.now() + hours * 60 * 60 * 1000);
    }
    async authenticateWithLabSystem(config) {
        return { token: 'mock_lab_token' };
    }
    async fetchLabResults(config, token) {
        return [];
    }
    async processLabResults(results) {
        return results.map(r => ({ ...r, success: true }));
    }
    async updatePatientLabRecords(results) {
    }
    async syncMedicationData(config) {
        return { medications: 0, updated: 0 };
    }
    async syncMedicationOrders(config) {
        return { orders: 0, updated: 0 };
    }
    async validateFHIRResource(resourceType, data) {
        return { valid: true, errors: [] };
    }
    async transformFHIRToInternal(resourceType, data) {
        return data;
    }
    async storeFHIRResource(resourceType, data) {
        return { id: 'mock_id', version: 1, updatedAt: new Date() };
    }
    checkSystemHealth(integration) {
        return Math.random() > 0.1 ? 'healthy' : 'warning';
    }
    getLastSyncStatus(integration) {
        return Math.random() > 0.2 ? 'success' : 'error';
    }
    calculateUptime(integration) {
        return Math.random() * 100;
    }
    calculateErrorRate(integration) {
        return Math.random() * 5;
    }
    calculateOverallHealth(status) {
        const healthyCount = status.filter(s => s.status === 'healthy').length;
        return healthyCount / status.length > 0.8 ? 'excellent' : 'good';
    }
    async getRecentActivity() {
        return {
            messages: 0,
            images: 0,
            syncs: 0,
            errors: 0,
        };
    }
    async processPatientAdmission(patientData, locationData) {
        return { success: true, admissionId: 'mock_admission_id' };
    }
    async processPatientTransfer(patientData, locationData) {
        return { success: true, transferId: 'mock_transfer_id' };
    }
    async processPatientDischarge(patientData, locationData) {
        return { success: true, dischargeId: 'mock_discharge_id' };
    }
    async processOrderMessage(orderData, observationData) {
        return { success: true, orderId: 'mock_order_id' };
    }
    async processLabResultMessage(request, results) {
        return { success: true, resultIds: results.map(r => 'mock_result_id') };
    }
};
exports.ExternalSystemsService = ExternalSystemsService;
exports.ExternalSystemsService = ExternalSystemsService = ExternalSystemsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExternalSystemsService);
//# sourceMappingURL=external-systems.service.js.map