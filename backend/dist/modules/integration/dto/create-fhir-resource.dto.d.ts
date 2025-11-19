export declare class CreateFHIRResourceDto {
    resourceType: 'Patient' | 'Observation' | 'Condition' | 'Procedure' | 'Medication' | 'Encounter' | 'DiagnosticReport';
    resource: any;
    id?: string;
    version?: string;
}
