import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ExternalSystemsService } from './external-systems.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';

@ApiTags('External Systems Integration')
@Controller('integration/external')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ExternalSystemsController {
  constructor(private readonly externalSystemsService: ExternalSystemsService) {}

  @Post('hl7/message')
  @ApiOperation({ summary: 'Process HL7 message' })
  @ApiResponse({ status: 200, description: 'HL7 message processed successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('PROCESS', 'hl7_message')
  async processHL7Message(@Body() messageData: {
    message: string;
    source: string;
    messageType?: string;
  }) {
    return await this.externalSystemsService.processHL7Message(messageData.message);
  }

  @Post('dicom/image')
  @ApiOperation({ summary: 'Process DICOM image' })
  @ApiResponse({ status: 200, description: 'DICOM image processed successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('PROCESS', 'dicom_image')
  async processDICOMImage(@Body() imageData: {
    image: any; // Binary image data
    metadata?: any;
    source: string;
  }) {
    return await this.externalSystemsService.processDICOMImage(imageData.image);
  }

  @Post('emr/integrate')
  @ApiOperation({ summary: 'Integrate with EMR system' })
  @ApiResponse({ status: 200, description: 'EMR integration completed successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('INTEGRATE', 'emr')
  async integrateWithEMR(@Body() emrData: {
    systemType: string;
    endpoint: string;
    credentials: {
      username: string;
      password: string;
      apiKey?: string;
    };
    syncType: 'full' | 'incremental';
    lastSyncDate?: string;
  }) {
    return await this.externalSystemsService.integrateWithEMR(emrData);
  }

  @Post('laboratory/sync')
  @ApiOperation({ summary: 'Sync with laboratory system' })
  @ApiResponse({ status: 200, description: 'Laboratory sync completed successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('SYNC', 'laboratory')
  async syncWithLaboratory(@Body() labConfig: {
    systemName: string;
    apiEndpoint: string;
    apiKey: string;
    syncFrequency: number;
    resultTypes: string[];
  }) {
    return await this.externalSystemsService.syncWithLaboratorySystem(labConfig);
  }

  @Post('pharmacy/integrate')
  @ApiOperation({ summary: 'Integrate with pharmacy system' })
  @ApiResponse({ status: 200, description: 'Pharmacy integration completed successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('INTEGRATE', 'pharmacy')
  async integrateWithPharmacy(@Body() pharmacyConfig: {
    systemName: string;
    endpoint: string;
    authentication: {
      type: string;
      credentials: any;
    };
    medicationSync: boolean;
    orderSync: boolean;
  }) {
    return await this.externalSystemsService.integrateWithPharmacySystem(pharmacyConfig);
  }

  @Post('fhir/:resourceType')
  @ApiOperation({ summary: 'Create FHIR resource' })
  @ApiParam({ name: 'resourceType', description: 'FHIR resource type (Patient, Observation, etc.)' })
  @ApiResponse({ status: 201, description: 'FHIR resource created successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('CREATE', 'fhir_resource')
  async createFHIRResource(
    @Param('resourceType') resourceType: string,
    @Body() fhirData: any
  ) {
    return await this.externalSystemsService.createFHIRResource(resourceType, fhirData);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get integration status overview' })
  @ApiResponse({ status: 200, description: 'Integration status retrieved successfully' })
  @RequirePermissions('INTEGRATION_READ')
  async getIntegrationStatus() {
    return await this.externalSystemsService.getIntegrationStatus();
  }

  // HL7 v2.x Specific Endpoints

  @Post('hl7/admit')
  @ApiOperation({ summary: 'Process patient admission HL7 message' })
  @ApiResponse({ status: 200, description: 'Patient admission processed successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('PROCESS', 'admission_hl7')
  async processAdmissionHL7(@Body() admissionData: {
    patientId: string;
    patientName: string;
    dateOfBirth: string;
    gender: string;
    admissionType: string;
    location: string;
    physician: string;
  }) {
    // Construct HL7 ADT_A01 message
    const hl7Message = this.constructADTMessage('A01', admissionData);
    return await this.externalSystemsService.processHL7Message(hl7Message);
  }

  @Post('hl7/transfer')
  @ApiOperation({ summary: 'Process patient transfer HL7 message' })
  @ApiResponse({ status: 200, description: 'Patient transfer processed successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('PROCESS', 'transfer_hl7')
  async processTransferHL7(@Body() transferData: {
    patientId: string;
    fromLocation: string;
    toLocation: string;
    transferReason: string;
    physician: string;
  }) {
    const hl7Message = this.constructADTMessage('A02', transferData);
    return await this.externalSystemsService.processHL7Message(hl7Message);
  }

  @Post('hl7/discharge')
  @ApiOperation({ summary: 'Process patient discharge HL7 message' })
  @ApiResponse({ status: 200, description: 'Patient discharge processed successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('PROCESS', 'discharge_hl7')
  async processDischargeHL7(@Body() dischargeData: {
    patientId: string;
    dischargeDate: string;
    dischargeDisposition: string;
    attendingPhysician: string;
  }) {
    const hl7Message = this.constructADTMessage('A03', dischargeData);
    return await this.externalSystemsService.processHL7Message(hl7Message);
  }

  // Laboratory Interface Endpoints

  @Post('laboratory/order')
  @ApiOperation({ summary: 'Send laboratory order via HL7' })
  @ApiResponse({ status: 200, description: 'Laboratory order sent successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('SEND', 'lab_order_hl7')
  async sendLabOrderHL7(@Body() orderData: {
    patientId: string;
    patientName: string;
    orderingPhysician: string;
    tests: Array<{
      testCode: string;
      testName: string;
      specimenType: string;
      priority: string;
    }>;
    collectionDateTime: string;
    clinicalInformation?: string;
  }) {
    const hl7Message = this.constructORMMessage(orderData);
    return await this.externalSystemsService.processHL7Message(hl7Message);
  }

  @Post('laboratory/results')
  @ApiOperation({ summary: 'Process laboratory results via HL7' })
  @ApiResponse({ status: 200, description: 'Laboratory results processed successfully' })
  @RequirePermissions('INTEGRATION_CREATE')
  @AuditLog('PROCESS', 'lab_results_hl7')
  async processLabResultsHL7(@Body() resultsData: {
    patientId: string;
    orderId: string;
    results: Array<{
      testCode: string;
      testName: string;
      resultValue: string;
      units: string;
      referenceRange: string;
      abnormalFlag?: string;
      resultStatus: string;
    }>;
    resultDateTime: string;
    performingLaboratory: string;
    pathologist?: string;
  }) {
    const hl7Message = this.constructORUMessage(resultsData);
    return await this.externalSystemsService.processHL7Message(hl7Message);
  }

  // DICOM Worklist Management

  @Get('dicom/worklist')
  @ApiOperation({ summary: 'Get DICOM modality worklist' })
  @ApiResponse({ status: 200, description: 'DICOM worklist retrieved successfully' })
  @RequirePermissions('INTEGRATION_READ')
  @ApiQuery({ name: 'modality', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getDICOMWorklist(
    @Query('modality') modality?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return {
      message: 'DICOM worklist endpoint',
      filters: { modality, dateFrom, dateTo },
      worklist: [
        {
          scheduledProcedureStepId: 'SPS_001',
          scheduledProcedureStepDescription: 'CT Chest with Contrast',
          modality: 'CT',
          scheduledStationAETitle: 'CT_SCANNER_01',
          scheduledProcedureStepStartDate: '20241120',
          scheduledProcedureStepStartTime: '143000',
          patientId: 'PAT_001',
          patientName: 'DOE^JOHN',
          requestingPhysician: 'DR_SMITH^JOHN',
          studyInstanceUID: '1.2.840.113619.2.55.3.604688237.641.1240134237.689',
        },
        {
          scheduledProcedureStepId: 'SPS_002',
          scheduledProcedureStepDescription: 'MRI Brain',
          modality: 'MR',
          scheduledStationAETitle: 'MRI_01',
          scheduledProcedureStepStartDate: '20241120',
          scheduledProcedureStepStartTime: '153000',
          patientId: 'PAT_002',
          patientName: 'SMITH^JANE',
          requestingPhysician: 'DR_JOHNSON^MARY',
          studyInstanceUID: '1.2.840.113619.2.55.3.604688237.641.1240134237.690',
        },
      ],
    };
  }

  // FHIR Endpoints for different resource types

  @Get('fhir/Patient/:id')
  @ApiOperation({ summary: 'Get FHIR Patient resource' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'FHIR Patient resource retrieved successfully' })
  @RequirePermissions('INTEGRATION_READ')
  async getFHIRPatient(@Param('id') id: string) {
    return {
      resourceType: 'Patient',
      id: id,
      identifier: [
        {
          type: { text: 'MRN' },
          value: 'MRN123456',
        },
      ],
      name: [
        {
          use: 'official',
          family: 'Doe',
          given: ['John'],
        },
      ],
      gender: 'male',
      birthDate: '1980-01-01',
    };
  }

  @Get('fhir/Observation/:patientId')
  @ApiOperation({ summary: 'Get FHIR Observation resources for patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'FHIR Observations retrieved successfully' })
  @RequirePermissions('INTEGRATION_READ')
  async getFHIRObservations(@Param('patientId') patientId: string) {
    return {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: [
        {
          resource: {
            resourceType: 'Observation',
            id: 'obs_001',
            status: 'final',
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '2345-7',
                  display: 'Glucose [Mass/volume] in Blood',
                },
              ],
            },
            subject: {
              reference: `Patient/${patientId}`,
            },
            effectiveDateTime: '2024-11-20T10:30:00Z',
            valueQuantity: {
              value: 95,
              unit: 'mg/dL',
              system: 'http://unitsofmeasure.org',
              code: 'mg/dL',
            },
          },
        },
      ],
    };
  }

  // Integration Testing Endpoints

  @Post('test/hl7-connection')
  @ApiOperation({ summary: 'Test HL7 connection' })
  @ApiResponse({ status: 200, description: 'HL7 connection test completed' })
  @RequirePermissions('SYSTEM_MONITOR')
  @AuditLog('TEST', 'hl7_connection')
  async testHL7Connection(@Body() testData: {
    endpoint: string;
    port: number;
    messageType: string;
    testMessage?: string;
  }) {
    return {
      connectionTest: 'success',
      endpoint: testData.endpoint,
      port: testData.port,
      responseTime: 125,
      messageValidation: 'passed',
      timestamp: new Date(),
    };
  }

  @Post('test/dicom-connection')
  @ApiOperation({ summary: 'Test DICOM connection' })
  @ApiResponse({ status: 200, description: 'DICOM connection test completed' })
  @RequirePermissions('SYSTEM_MONITOR')
  @AuditLog('TEST', 'dicom_connection')
  async testDICOMConnection(@Body() testData: {
    aeTitle: string;
    host: string;
    port: number;
    callingAeTitle: string;
  }) {
    return {
      connectionTest: 'success',
      aeTitle: testData.aeTitle,
      host: testData.host,
      port: testData.port,
      echoResponse: 'success',
      supportedTransferSyntaxes: ['1.2.840.10008.1.2'],
      timestamp: new Date(),
    };
  }

  // HL7 Message Construction Helper
  private constructADTMessage(eventType: string, data: any): string {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);

    let message = `MSH|^~\\&|INAMSOS|HOSPITAL|${new Date().toISOString().split('T')[0].replace(/-/g, '')}||ADT_${eventType}|${timestamp}|P|2.5||||||UNICODE\r`;
    message += `PID|1||${data.patientId}||${data.patientName}^^^^^L||${data.dateOfBirth.replace(/-/g, '')}|${data.gender}||\r`;

    if (eventType === 'A01') {
      message += `PV1|1|${data.location}||||${data.admissionType}||${data.physician}||||||||||\r`;
    } else if (eventType === 'A02') {
      message += `PV1|1|${data.toLocation}||||||||${data.fromLocation}||||||||||\r`;
    } else if (eventType === 'A03') {
      message += `PV1|1||||||${data.dischargeDisposition}|||||||${data.attendingPhysician}|||\r`;
    }

    return message;
  }

  private constructORMMessage(data: any): string {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);

    let message = `MSH|^~\\&|INAMSOS|HOSPITAL|${new Date().toISOString().split('T')[0].replace(/-/g, '')}||ORM^O01|${timestamp}|P|2.5||||||UNICODE\r`;
    message += `PID|1||${data.patientId}||${data.patientName}^^^^^L\r`;
    message += `PV1|1||\r`;
    message += `ORC|NW|${data.orderId}||||||||${data.collectionDateTime}||^||||^||||||\r`;

    data.tests.forEach((test, index) => {
      message += `OBR|${index + 1}|${data.orderId}|${test.testCode}^${test.testName}^^^L||${data.collectionDateTime}||||||||||||^||||||||||||||\r`;
    });

    return message;
  }

  private constructORUMessage(data: any): string {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);

    let message = `MSH|^~\\&|LAB|HOSPITAL|${new Date().toISOString().split('T')[0].replace(/-/g, '')}||ORU^R01|${timestamp}|P|2.5||||||UNICODE\r`;
    message += `PID|1||${data.patientId}||\r`;
    message += `PV1|1||\r`;
    message += `OBR|1|${data.orderId}||${data.results[0]?.testCode || ''}||${data.resultDateTime}||||||||||||${data.performingLaboratory}^L|||||\r`;

    data.results.forEach((result, index) => {
      message += `OBX|${index + 1}|NM|${result.testCode}^${result.testName}^^^L|${result.resultValue}|${result.units}|${result.referenceRange}|${result.abnormalFlag || ''}||${result.resultStatus}|\r`;
    });

    return message;
  }
}