import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class ExternalSystemsService {
  private readonly logger = new Logger(ExternalSystemsService.name);

  constructor(private prisma: PrismaService) {}

  async processHL7Message(message: string): Promise<any> {
    try {
      this.logger.log('Processing HL7 message');

      // Parse HL7 message
      const parsedMessage = this.parseHL7Message(message);

      // Determine message type and process accordingly
      switch (parsedMessage.messageType) {
        case 'ADT_A01': // Patient admission
          return await this.processADTMessage(parsedMessage, 'admission');
        case 'ADT_A02': // Patient transfer
          return await this.processADTMessage(parsedMessage, 'transfer');
        case 'ADT_A03': // Patient discharge
          return await this.processADTMessage(parsedMessage, 'discharge');
        case 'ORM_O01': // Order message
          return await this.processORMMessage(parsedMessage);
        case 'ORU_R01': // Observation result message
          return await this.processORUMessage(parsedMessage);
        default:
          throw new Error(`Unsupported HL7 message type: ${parsedMessage.messageType}`);
      }
    } catch (error) {
      this.logger.error('Error processing HL7 message', error);
      throw error;
    }
  }

  async processDICOMImage(imageData: any): Promise<any> {
    try {
      this.logger.log('Processing DICOM image');

      // Extract DICOM metadata
      const metadata = this.extractDICOMMetadata(imageData);

      // Store image and link to patient record
      const imageRecord = await this.storeDICOMImage(imageData, metadata);

      // Update related medical records
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
    } catch (error) {
      this.logger.error('Error processing DICOM image', error);
      throw error;
    }
  }

  async integrateWithEMR(emrData: {
    systemType: string;
    endpoint: string;
    credentials: any;
    syncType: 'full' | 'incremental';
    lastSyncDate?: string;
  }): Promise<any> {
    try {
      this.logger.log(`Integrating with EMR system: ${emrData.systemType}`);

      // Establish connection to EMR system
      const connection = await this.establishEMRConnection(emrData);

      // Fetch data based on sync type
      const data = await this.fetchEMRData(connection, emrData.syncType, emrData.lastSyncDate);

      // Transform and import data
      const importResult = await this.importEMRData(data, emrData.systemType);

      // Create integration log
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
    } catch (error) {
      this.logger.error('Error integrating with EMR system', error);
      throw error;
    }
  }

  async syncWithLaboratorySystem(labConfig: {
    systemName: string;
    apiEndpoint: string;
    apiKey: string;
    syncFrequency: number; // hours
    resultTypes: string[];
  }): Promise<any> {
    try {
      this.logger.log(`Syncing with laboratory system: ${labConfig.systemName}`);

      // Authenticate with lab system
      const authResult = await this.authenticateWithLabSystem(labConfig);

      // Fetch pending results
      const results = await this.fetchLabResults(labConfig, authResult.token);

      // Process and store results
      const processedResults = await this.processLabResults(results);

      // Update patient records
      await this.updatePatientLabRecords(processedResults);

      return {
        syncId: `lab_sync_${Date.now()}`,
        systemName: labConfig.systemName,
        resultsProcessed: processedResults.length,
        successfulUpdates: processedResults.filter(r => r.success).length,
        failedUpdates: processedResults.filter(r => !r.success).length,
        nextSync: new Date(Date.now() + labConfig.syncFrequency * 60 * 60 * 1000),
      };
    } catch (error) {
      this.logger.error('Error syncing with laboratory system', error);
      throw error;
    }
  }

  async integrateWithPharmacySystem(pharmacyConfig: {
    systemName: string;
    endpoint: string;
    authentication: any;
    medicationSync: boolean;
    orderSync: boolean;
  }): Promise<any> {
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
    } catch (error) {
      this.logger.error('Error integrating with pharmacy system', error);
      throw error;
    }
  }

  async createFHIRResource(resourceType: string, data: any): Promise<any> {
    try {
      this.logger.log(`Creating FHIR resource: ${resourceType}`);

      // Validate FHIR resource
      const validationResult = await this.validateFHIRResource(resourceType, data);

      if (!validationResult.valid) {
        throw new Error(`Invalid FHIR resource: ${validationResult.errors.join(', ')}`);
      }

      // Transform to internal format
      const internalData = await this.transformFHIRToInternal(resourceType, data);

      // Store resource
      const storedResource = await this.storeFHIRResource(resourceType, internalData);

      return {
        resourceId: storedResource.id,
        resourceType,
        fhirId: data.id || storedResource.id,
        version: storedResource.version,
        lastModified: storedResource.updatedAt,
        created: new Date(),
      };
    } catch (error) {
      this.logger.error('Error creating FHIR resource', error);
      throw error;
    }
  }

  async getIntegrationStatus(): Promise<any> {
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
    } catch (error) {
      this.logger.error('Error getting integration status', error);
      throw error;
    }
  }

  // HL7 Processing Methods
  private parseHL7Message(message: string): any {
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

  private async processADTMessage(message: any, actionType: string): Promise<any> {
    const patientSegment = message.segments.find(seg => seg.startsWith('PID'));
    const pv1Segment = message.segments.find(seg => seg.startsWith('PV1'));

    if (!patientSegment) {
      throw new Error('ADT message missing PID segment');
    }

    const patientData = this.parsePIDSegment(patientSegment);
    const locationData = pv1Segment ? this.parsePV1Segment(pv1Segment) : null;

    // Process patient data
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

  private async processORMMessage(message: any): Promise<any> {
    const orcSegment = message.segments.find(seg => seg.startsWith('ORC'));
    const obrSegment = message.segments.find(seg => seg.startsWith('OBR'));

    if (!orcSegment) {
      throw new Error('ORM message missing ORC segment');
    }

    const orderData = this.parseORCSegment(orcSegment);
    const observationData = obrSegment ? this.parseOBRSegment(obrSegment) : null;

    // Create or update order based on message
    return await this.processOrderMessage(orderData, observationData);
  }

  private async processORUMessage(message: any): Promise<any> {
    const obrSegment = message.segments.find(seg => seg.startsWith('OBR'));
    const obxSegments = message.segments.filter(seg => seg.startsWith('OBX'));

    if (!obrSegment) {
      throw new Error('ORU message missing OBR segment');
    }

    const observationRequest = this.parseOBRSegment(obrSegment);
    const results = obxSegments.map(seg => this.parseOBXSegment(seg));

    return await this.processLabResultMessage(observationRequest, results);
  }

  // DICOM Processing Methods
  private extractDICOMMetadata(imageData: any): any {
    // Simplified DICOM metadata extraction
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

  private async storeDICOMImage(imageData: any, metadata: any): Promise<any> {
    // Store DICOM image metadata in database
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

  private async updateMedicalRecordsWithDICOM(imageRecord: any, metadata: any): Promise<void> {
    // Update patient medical record with new imaging study
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

  // Helper methods
  private parseHL7Timestamp(timestamp: string): Date {
    // HL7 timestamp format: YYYYMMDDHHMMSS
    const year = parseInt(timestamp.substring(0, 4));
    const month = parseInt(timestamp.substring(4, 6)) - 1;
    const day = parseInt(timestamp.substring(6, 8));
    const hour = parseInt(timestamp.substring(8, 10));
    const minute = parseInt(timestamp.substring(10, 12));
    const second = parseInt(timestamp.substring(12, 14));

    return new Date(year, month, day, hour, minute, second);
  }

  private parsePIDSegment(pidSegment: string): any {
    const fields = pidSegment.split('|');
    return {
      id: fields[4] || 'UNKNOWN',
      name: fields[5] || 'Unknown',
      dateOfBirth: fields[7] ? this.parseHL7Timestamp(fields[7]) : null,
      gender: fields[8] || 'U',
    };
  }

  private parsePV1Segment(pv1Segment: string): any {
    const fields = pv1Segment.split('|');
    return {
      patientClass: fields[2] || 'UNKNOWN',
      assignedLocation: fields[3] || '',
      admissionType: fields[2] || '',
    };
  }

  private parseORCSegment(orcSegment: string): any {
    const fields = orcSegment.split('|');
    return {
      orderControl: fields[1] || '',
      placerOrderNumber: fields[2] || '',
      fillerOrderNumber: fields[3] || '',
      orderStatus: fields[5] || '',
    };
  }

  private parseOBRSegment(obrSegment: string): any {
    const fields = obrSegment.split('|');
    return {
      placerOrderNumber: fields[2] || '',
      fillerOrderNumber: fields[3] || '',
      universalServiceId: fields[4] || '',
      observationDateTime: fields[7] ? this.parseHL7Timestamp(fields[7]) : new Date(),
    };
  }

  private parseOBXSegment(obxSegment: string): any {
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

  // Placeholder methods for other integration functions
  private async establishEMRConnection(config: any): Promise<any> {
    return { token: 'mock_token', endpoint: config.endpoint };
  }

  private async fetchEMRData(connection: any, syncType: string, lastSyncDate?: string): Promise<any> {
    return { patients: [], encounters: [], orders: [] };
  }

  private async importEMRData(data: any, systemType: string): Promise<any> {
    return { processed: 0, created: 0, updated: 0, errors: [] };
  }

  private async logIntegration(system: string, systemType: string, result: any): Promise<void> {
    // Log integration activity
  }

  private calculateNextSyncDate(syncType: string): Date {
    const hours = syncType === 'full' ? 24 : 1;
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  private async authenticateWithLabSystem(config: any): Promise<any> {
    return { token: 'mock_lab_token' };
  }

  private async fetchLabResults(config: any, token: string): Promise<any> {
    return [];
  }

  private async processLabResults(results: any[]): Promise<any[]> {
    return results.map(r => ({ ...r, success: true }));
  }

  private async updatePatientLabRecords(results: any[]): Promise<void> {
    // Update patient records with lab results
  }

  private async syncMedicationData(config: any): Promise<any> {
    return { medications: 0, updated: 0 };
  }

  private async syncMedicationOrders(config: any): Promise<any> {
    return { orders: 0, updated: 0 };
  }

  private async validateFHIRResource(resourceType: string, data: any): Promise<any> {
    return { valid: true, errors: [] };
  }

  private async transformFHIRToInternal(resourceType: string, data: any): Promise<any> {
    return data;
  }

  private async storeFHIRResource(resourceType: string, data: any): Promise<any> {
    return { id: 'mock_id', version: 1, updatedAt: new Date() };
  }

  private checkSystemHealth(integration: any): string {
    return Math.random() > 0.1 ? 'healthy' : 'warning';
  }

  private getLastSyncStatus(integration: any): string {
    return Math.random() > 0.2 ? 'success' : 'error';
  }

  private calculateUptime(integration: any): number {
    return Math.random() * 100;
  }

  private calculateErrorRate(integration: any): number {
    return Math.random() * 5;
  }

  private calculateOverallHealth(status: any[]): string {
    const healthyCount = status.filter(s => s.status === 'healthy').length;
    return healthyCount / status.length > 0.8 ? 'excellent' : 'good';
  }

  private async getRecentActivity(): Promise<any> {
    return {
      messages: 0,
      images: 0,
      syncs: 0,
      errors: 0,
    };
  }

  // Additional placeholder methods for processing functions
  private async processPatientAdmission(patientData: any, locationData: any): Promise<any> {
    return { success: true, admissionId: 'mock_admission_id' };
  }

  private async processPatientTransfer(patientData: any, locationData: any): Promise<any> {
    return { success: true, transferId: 'mock_transfer_id' };
  }

  private async processPatientDischarge(patientData: any, locationData: any): Promise<any> {
    return { success: true, dischargeId: 'mock_discharge_id' };
  }

  private async processOrderMessage(orderData: any, observationData: any): Promise<any> {
    return { success: true, orderId: 'mock_order_id' };
  }

  private async processLabResultMessage(request: any, results: any[]): Promise<any> {
    return { success: true, resultIds: results.map(r => 'mock_result_id') };
  }
}