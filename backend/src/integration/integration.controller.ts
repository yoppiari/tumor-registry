import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpStatus,
  HttpCode,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IntegrationService } from './integration.service';
import {
  ExternalSystem,
  HL7Message,
  FHIRResource,
  IntegrationWorkflow,
  DataMapping,
  IntegrationHealth
} from './interfaces/integration.interface';
import { CreateExternalSystemDto } from './dto/create-integration.dto';
import { UpdateExternalSystemDto } from './dto/update-integration.dto';
import { CreateHL7MessageDto } from './dto/create-hl7-message.dto';
import { CreateFHIRResourceDto } from './dto/create-fhir-resource.dto';
import { CreateWorkflowDto } from './dto/create-workflow.dto';

@ApiTags('Integration')
@Controller('integration')
export class IntegrationController {
  private readonly logger = new Logger(IntegrationController.name);

  constructor(private readonly integrationService: IntegrationService) {}

  // External Systems Endpoints
  @Post('systems')
  @ApiOperation({ summary: 'Create a new external system configuration' })
  @ApiResponse({ status: 201, description: 'External system created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createExternalSystem(@Body() createDto: CreateExternalSystemDto): Promise<ExternalSystem> {
    return this.integrationService.createExternalSystem(createDto);
  }

  @Get('systems')
  @ApiOperation({ summary: 'Get all external systems' })
  @ApiResponse({ status: 200, description: 'External systems retrieved successfully' })
  async getExternalSystems(): Promise<ExternalSystem[]> {
    return this.integrationService.getExternalSystems();
  }

  @Get('systems/:id')
  @ApiOperation({ summary: 'Get external system by ID' })
  @ApiParam({ name: 'id', description: 'External system ID' })
  @ApiResponse({ status: 200, description: 'External system retrieved successfully' })
  @ApiResponse({ status: 404, description: 'External system not found' })
  async getExternalSystem(@Param('id') id: string): Promise<ExternalSystem> {
    return this.integrationService.getExternalSystem(id);
  }

  @Put('systems/:id')
  @ApiOperation({ summary: 'Update external system configuration' })
  @ApiParam({ name: 'id', description: 'External system ID' })
  @ApiResponse({ status: 200, description: 'External system updated successfully' })
  @ApiResponse({ status: 404, description: 'External system not found' })
  async updateExternalSystem(
    @Param('id') id: string,
    @Body() updateDto: UpdateExternalSystemDto
  ): Promise<ExternalSystem> {
    return this.integrationService.updateExternalSystem(id, updateDto);
  }

  @Delete('systems/:id')
  @ApiOperation({ summary: 'Delete external system' })
  @ApiParam({ name: 'id', description: 'External system ID' })
  @ApiResponse({ status: 200, description: 'External system deleted successfully' })
  @ApiResponse({ status: 404, description: 'External system not found' })
  @HttpCode(HttpStatus.OK)
  async deleteExternalSystem(@Param('id') id: string): Promise<{ message: string }> {
    await this.integrationService.deleteExternalSystem(id);
    return { message: 'External system deleted successfully' };
  }

  // HL7 Message Endpoints
  @Post('hl7/messages')
  @ApiOperation({ summary: 'Process incoming HL7 message' })
  @ApiResponse({ status: 201, description: 'HL7 message processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid HL7 message format' })
  async processHL7Message(@Body() createDto: CreateHL7MessageDto): Promise<HL7Message> {
    return this.integrationService.processHL7Message(createDto);
  }

  @Get('hl7/messages')
  @ApiOperation({ summary: 'Get HL7 messages with optional filters' })
  @ApiQuery({ name: 'messageType', required: false, description: 'Filter by message type (ADT, ORU, etc.)' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by processing status' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Filter messages from date' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Filter messages to date' })
  @ApiResponse({ status: 200, description: 'HL7 messages retrieved successfully' })
  async getHL7Messages(
    @Query('messageType') messageType?: string,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: Date,
    @Query('dateTo') dateTo?: Date
  ): Promise<HL7Message[]> {
    return this.integrationService.getHL7Messages({
      messageType,
      status,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined
    });
  }

  // FHIR Resource Endpoints
  @Post('fhir/resources')
  @ApiOperation({ summary: 'Process incoming FHIR resource' })
  @ApiResponse({ status: 201, description: 'FHIR resource processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid FHIR resource format' })
  async processFHIRResource(@Body() createDto: CreateFHIRResourceDto): Promise<FHIRResource> {
    return this.integrationService.processFHIRResource(createDto);
  }

  @Get('fhir/resources')
  @ApiOperation({ summary: 'Get FHIR resources with optional filters' })
  @ApiQuery({ name: 'resourceType', required: false, description: 'Filter by resource type (Patient, Observation, etc.)' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by processing status' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Filter resources from date' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Filter resources to date' })
  @ApiResponse({ status: 200, description: 'FHIR resources retrieved successfully' })
  async getFHIRResources(
    @Query('resourceType') resourceType?: string,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: Date,
    @Query('dateTo') dateTo?: Date
  ): Promise<FHIRResource[]> {
    return this.integrationService.getFHIRResources({
      resourceType,
      status,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined
    });
  }

  // Integration Workflow Endpoints
  @Post('workflows')
  @ApiOperation({ summary: 'Create a new integration workflow' })
  @ApiResponse({ status: 201, description: 'Workflow created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createWorkflow(@Body() createDto: CreateWorkflowDto): Promise<IntegrationWorkflow> {
    return this.integrationService.createWorkflow(createDto);
  }

  @Get('workflows')
  @ApiOperation({ summary: 'Get all integration workflows' })
  @ApiResponse({ status: 200, description: 'Workflows retrieved successfully' })
  async getWorkflows(): Promise<IntegrationWorkflow[]> {
    return this.integrationService.getWorkflows();
  }

  @Post('workflows/:id/execute')
  @ApiOperation({ summary: 'Execute an integration workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow execution started' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  @ApiResponse({ status: 400, description: 'Workflow is not active' })
  @HttpCode(HttpStatus.OK)
  async executeWorkflow(@Param('id') id: string): Promise<{ message: string }> {
    await this.integrationService.executeWorkflow(id);
    return { message: 'Workflow execution started successfully' };
  }

  // Data Mapping Endpoints
  @Post('mappings')
  @ApiOperation({ summary: 'Create a new data mapping configuration' })
  @ApiResponse({ status: 201, description: 'Data mapping created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createDataMapping(@Body() mapping: Partial<DataMapping>): Promise<DataMapping> {
    return this.integrationService.createDataMapping(mapping);
  }

  @Get('mappings')
  @ApiOperation({ summary: 'Get all data mappings' })
  @ApiResponse({ status: 200, description: 'Data mappings retrieved successfully' })
  async getDataMappings(): Promise<DataMapping[]> {
    return this.integrationService.getDataMappings();
  }

  // Health Check Endpoints
  @Get('health')
  @ApiOperation({ summary: 'Get health status of all integration systems' })
  @ApiResponse({ status: 200, description: 'Health checks completed successfully' })
  async getSystemHealth(): Promise<IntegrationHealth[]> {
    return this.integrationService.getSystemHealth();
  }

  @Get('health/:systemId')
  @ApiOperation({ summary: 'Get health status of specific integration system' })
  @ApiParam({ name: 'systemId', description: 'External system ID' })
  @ApiResponse({ status: 200, description: 'Health check completed successfully' })
  @ApiResponse({ status: 404, description: 'System not found' })
  async getSystemHealthById(@Param('systemId') systemId: string): Promise<IntegrationHealth[]> {
    return this.integrationService.getSystemHealth(systemId);
  }

  // HL7 v2 Specific Endpoints
  @Post('hl7/v2/adt')
  @ApiOperation({ summary: 'Process HL7 v2 ADT (Admission, Discharge, Transfer) message' })
  @ApiResponse({ status: 201, description: 'ADT message processed successfully' })
  async processADTMessage(@Body() createDto: CreateHL7MessageDto): Promise<HL7Message> {
    const adtDto = {
      ...createDto,
      messageType: 'ADT',
      triggerEvent: createDto.triggerEvent || 'A01'
    };
    return this.integrationService.processHL7Message(adtDto);
  }

  @Post('hl7/v2/oru')
  @ApiOperation({ summary: 'Process HL7 v2 ORU (Observation Result Unsolicited) message' })
  @ApiResponse({ status: 201, description: 'ORU message processed successfully' })
  async processORUMessage(@Body() createDto: CreateHL7MessageDto): Promise<HL7Message> {
    const oruDto = {
      ...createDto,
      messageType: 'ORU',
      triggerEvent: createDto.triggerEvent || 'R01'
    };
    return this.integrationService.processHL7Message(oruDto);
  }

  @Post('hl7/v2/orm')
  @ApiOperation({ summary: 'Process HL7 v2 ORM (Order) message' })
  @ApiResponse({ status: 201, description: 'ORM message processed successfully' })
  async processORMMessage(@Body() createDto: CreateHL7MessageDto): Promise<HL7Message> {
    const ormDto = {
      ...createDto,
      messageType: 'ORM',
      triggerEvent: createDto.triggerEvent || 'O01'
    };
    return this.integrationService.processHL7Message(ormDto);
  }

  // FHIR R4 Specific Endpoints
  @Post('fhir/r4/Patient')
  @ApiOperation({ summary: 'Process FHIR R4 Patient resource' })
  @ApiResponse({ status: 201, description: 'Patient resource processed successfully' })
  async processPatientResource(@Body() createDto: CreateFHIRResourceDto): Promise<FHIRResource> {
    const patientDto = {
      ...createDto,
      resourceType: 'Patient' as const,
      fhirVersion: 'R4'
    };
    return this.integrationService.processFHIRResource(patientDto);
  }

  @Post('fhir/r4/Observation')
  @ApiOperation({ summary: 'Process FHIR R4 Observation resource' })
  @ApiResponse({ status: 201, description: 'Observation resource processed successfully' })
  async processObservationResource(@Body() createDto: CreateFHIRResourceDto): Promise<FHIRResource> {
    const observationDto = {
      ...createDto,
      resourceType: 'Observation' as const,
      fhirVersion: 'R4'
    };
    return this.integrationService.processFHIRResource(observationDto);
  }

  @Post('fhir/r4/Condition')
  @ApiOperation({ summary: 'Process FHIR R4 Condition resource' })
  @ApiResponse({ status: 201, description: 'Condition resource processed successfully' })
  async processConditionResource(@Body() createDto: CreateFHIRResourceDto): Promise<FHIRResource> {
    const conditionDto = {
      ...createDto,
      resourceType: 'Condition' as const,
      fhirVersion: 'R4'
    };
    return this.integrationService.processFHIRResource(conditionDto);
  }

  @Post('fhir/r4/Procedure')
  @ApiOperation({ summary: 'Process FHIR R4 Procedure resource' })
  @ApiResponse({ status: 201, description: 'Procedure resource processed successfully' })
  async processProcedureResource(@Body() createDto: CreateFHIRResourceDto): Promise<FHIRResource> {
    const procedureDto = {
      ...createDto,
      resourceType: 'Procedure' as const,
      fhirVersion: 'R4'
    };
    return this.integrationService.processFHIRResource(procedureDto);
  }

  @Post('fhir/r4/Medication')
  @ApiOperation({ summary: 'Process FHIR R4 Medication resource' })
  @ApiResponse({ status: 201, description: 'Medication resource processed successfully' })
  async processMedicationResource(@Body() createDto: CreateFHIRResourceDto): Promise<FHIRResource> {
    const medicationDto = {
      ...createDto,
      resourceType: 'Medication' as const,
      fhirVersion: 'R4'
    };
    return this.integrationService.processFHIRResource(medicationDto);
  }

  @Post('fhir/r4/Encounter')
  @ApiOperation({ summary: 'Process FHIR R4 Encounter resource' })
  @ApiResponse({ status: 201, description: 'Encounter resource processed successfully' })
  async processEncounterResource(@Body() createDto: CreateFHIRResourceDto): Promise<FHIRResource> {
    const encounterDto = {
      ...createDto,
      resourceType: 'Encounter' as const,
      fhirVersion: 'R4'
    };
    return this.integrationService.processFHIRResource(encounterDto);
  }

  @Post('fhir/r4/DiagnosticReport')
  @ApiOperation({ summary: 'Process FHIR R4 DiagnosticReport resource' })
  @ApiResponse({ status: 201, description: 'DiagnosticReport resource processed successfully' })
  async processDiagnosticReportResource(@Body() createDto: CreateFHIRResourceDto): Promise<FHIRResource> {
    const diagnosticReportDto = {
      ...createDto,
      resourceType: 'DiagnosticReport' as const,
      fhirVersion: 'R4'
    };
    return this.integrationService.processFHIRResource(diagnosticReportDto);
  }

  // Batch Processing Endpoints
  @Post('batch/hl7')
  @ApiOperation({ summary: 'Process multiple HL7 messages in batch' })
  @ApiResponse({ status: 201, description: 'Batch HL7 processing completed' })
  async processBatchHL7(@Body() messages: CreateHL7MessageDto[]): Promise<{
    processed: number;
    successful: number;
    failed: number;
    results: HL7Message[];
  }> {
    const results: HL7Message[] = [];
    let successful = 0;
    let failed = 0;

    for (const messageDto of messages) {
      try {
        const result = await this.integrationService.processHL7Message(messageDto);
        results.push(result);
        if (result.processingStatus === 'completed') {
          successful++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        this.logger.error(`Failed to process HL7 message: ${error.message}`);
      }
    }

    return {
      processed: messages.length,
      successful,
      failed,
      results
    };
  }

  @Post('batch/fhir')
  @ApiOperation({ summary: 'Process multiple FHIR resources in batch' })
  @ApiResponse({ status: 201, description: 'Batch FHIR processing completed' })
  async processBatchFHIR(@Body() resources: CreateFHIRResourceDto[]): Promise<{
    processed: number;
    successful: number;
    failed: number;
    results: FHIRResource[];
  }> {
    const results: FHIRResource[] = [];
    let successful = 0;
    let failed = 0;

    for (const resourceDto of resources) {
      try {
        const result = await this.integrationService.processFHIRResource(resourceDto);
        results.push(result);
        if (result.processingStatus === 'created' || result.processingStatus === 'updated') {
          successful++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        this.logger.error(`Failed to process FHIR resource: ${error.message}`);
      }
    }

    return {
      processed: resources.length,
      successful,
      failed,
      results
    };
  }
}