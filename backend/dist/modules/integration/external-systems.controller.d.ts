import { ExternalSystemsService } from './external-systems.service';
export declare class ExternalSystemsController {
    private readonly externalSystemsService;
    constructor(externalSystemsService: ExternalSystemsService);
    processHL7Message(messageData: {
        message: string;
        source: string;
        messageType?: string;
    }): Promise<any>;
    processDICOMImage(imageData: {
        image: any;
        metadata?: any;
        source: string;
    }): Promise<any>;
    integrateWithEMR(emrData: {
        systemType: string;
        endpoint: string;
        credentials: {
            username: string;
            password: string;
            apiKey?: string;
        };
        syncType: 'full' | 'incremental';
        lastSyncDate?: string;
    }): Promise<any>;
    syncWithLaboratory(labConfig: {
        systemName: string;
        apiEndpoint: string;
        apiKey: string;
        syncFrequency: number;
        resultTypes: string[];
    }): Promise<any>;
    integrateWithPharmacy(pharmacyConfig: {
        systemName: string;
        endpoint: string;
        authentication: {
            type: string;
            credentials: any;
        };
        medicationSync: boolean;
        orderSync: boolean;
    }): Promise<any>;
    createFHIRResource(resourceType: string, fhirData: any): Promise<any>;
    getIntegrationStatus(): Promise<any>;
    processAdmissionHL7(admissionData: {
        patientId: string;
        patientName: string;
        dateOfBirth: string;
        gender: string;
        admissionType: string;
        location: string;
        physician: string;
    }): Promise<any>;
    processTransferHL7(transferData: {
        patientId: string;
        fromLocation: string;
        toLocation: string;
        transferReason: string;
        physician: string;
    }): Promise<any>;
    processDischargeHL7(dischargeData: {
        patientId: string;
        dischargeDate: string;
        dischargeDisposition: string;
        attendingPhysician: string;
    }): Promise<any>;
    sendLabOrderHL7(orderData: {
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
    }): Promise<any>;
    processLabResultsHL7(resultsData: {
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
    }): Promise<any>;
    getDICOMWorklist(modality?: string, dateFrom?: string, dateTo?: string): Promise<{
        message: string;
        filters: {
            modality: string;
            dateFrom: string;
            dateTo: string;
        };
        worklist: {
            scheduledProcedureStepId: string;
            scheduledProcedureStepDescription: string;
            modality: string;
            scheduledStationAETitle: string;
            scheduledProcedureStepStartDate: string;
            scheduledProcedureStepStartTime: string;
            patientId: string;
            patientName: string;
            requestingPhysician: string;
            studyInstanceUID: string;
        }[];
    }>;
    getFHIRPatient(id: string): Promise<{
        resourceType: string;
        id: string;
        identifier: {
            type: {
                text: string;
            };
            value: string;
        }[];
        name: {
            use: string;
            family: string;
            given: string[];
        }[];
        gender: string;
        birthDate: string;
    }>;
    getFHIRObservations(patientId: string): Promise<{
        resourceType: string;
        type: string;
        entry: {
            resource: {
                resourceType: string;
                id: string;
                status: string;
                code: {
                    coding: {
                        system: string;
                        code: string;
                        display: string;
                    }[];
                };
                subject: {
                    reference: string;
                };
                effectiveDateTime: string;
                valueQuantity: {
                    value: number;
                    unit: string;
                    system: string;
                    code: string;
                };
            };
        }[];
    }>;
    testHL7Connection(testData: {
        endpoint: string;
        port: number;
        messageType: string;
        testMessage?: string;
    }): Promise<{
        connectionTest: string;
        endpoint: string;
        port: number;
        responseTime: number;
        messageValidation: string;
        timestamp: Date;
    }>;
    testDICOMConnection(testData: {
        aeTitle: string;
        host: string;
        port: number;
        callingAeTitle: string;
    }): Promise<{
        connectionTest: string;
        aeTitle: string;
        host: string;
        port: number;
        echoResponse: string;
        supportedTransferSyntaxes: string[];
        timestamp: Date;
    }>;
    private constructADTMessage;
    private constructORMMessage;
    private constructORUMessage;
}
