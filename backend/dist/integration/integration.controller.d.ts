import { IntegrationService } from './integration.service';
import { ExternalSystem, HL7Message, FHIRResource, IntegrationWorkflow, DataMapping, IntegrationHealth } from './interfaces/integration.interface';
import { CreateExternalSystemDto } from './dto/create-integration.dto';
import { UpdateExternalSystemDto } from './dto/update-integration.dto';
import { CreateHL7MessageDto } from './dto/create-hl7-message.dto';
import { CreateFHIRResourceDto } from './dto/create-fhir-resource.dto';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
export declare class IntegrationController {
    private readonly integrationService;
    private readonly logger;
    constructor(integrationService: IntegrationService);
    createExternalSystem(createDto: CreateExternalSystemDto): Promise<ExternalSystem>;
    getExternalSystems(): Promise<ExternalSystem[]>;
    getExternalSystem(id: string): Promise<ExternalSystem>;
    updateExternalSystem(id: string, updateDto: UpdateExternalSystemDto): Promise<ExternalSystem>;
    deleteExternalSystem(id: string): Promise<{
        message: string;
    }>;
    processHL7Message(createDto: CreateHL7MessageDto): Promise<HL7Message>;
    getHL7Messages(messageType?: string, status?: string, dateFrom?: Date, dateTo?: Date): Promise<HL7Message[]>;
    processFHIRResource(createDto: CreateFHIRResourceDto): Promise<FHIRResource>;
    getFHIRResources(resourceType?: string, status?: string, dateFrom?: Date, dateTo?: Date): Promise<FHIRResource[]>;
    createWorkflow(createDto: CreateWorkflowDto): Promise<IntegrationWorkflow>;
    getWorkflows(): Promise<IntegrationWorkflow[]>;
    executeWorkflow(id: string): Promise<{
        message: string;
    }>;
    createDataMapping(mapping: Partial<DataMapping>): Promise<DataMapping>;
    getDataMappings(): Promise<DataMapping[]>;
    getSystemHealth(): Promise<IntegrationHealth[]>;
    getSystemHealthById(systemId: string): Promise<IntegrationHealth[]>;
    processADTMessage(createDto: CreateHL7MessageDto): Promise<HL7Message>;
    processORUMessage(createDto: CreateHL7MessageDto): Promise<HL7Message>;
    processORMMessage(createDto: CreateHL7MessageDto): Promise<HL7Message>;
    processPatientResource(createDto: CreateFHIRResourceDto): Promise<FHIRResource>;
    processObservationResource(createDto: CreateFHIRResourceDto): Promise<FHIRResource>;
    processConditionResource(createDto: CreateFHIRResourceDto): Promise<FHIRResource>;
    processProcedureResource(createDto: CreateFHIRResourceDto): Promise<FHIRResource>;
    processMedicationResource(createDto: CreateFHIRResourceDto): Promise<FHIRResource>;
    processEncounterResource(createDto: CreateFHIRResourceDto): Promise<FHIRResource>;
    processDiagnosticReportResource(createDto: CreateFHIRResourceDto): Promise<FHIRResource>;
    processBatchHL7(messages: CreateHL7MessageDto[]): Promise<{
        processed: number;
        successful: number;
        failed: number;
        results: HL7Message[];
    }>;
    processBatchFHIR(resources: CreateFHIRResourceDto[]): Promise<{
        processed: number;
        successful: number;
        failed: number;
        results: FHIRResource[];
    }>;
}
