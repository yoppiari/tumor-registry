export interface ExternalSystem {
    id: string;
    name: string;
    type: 'hl7' | 'fhir' | 'rest_api' | 'database' | 'file' | 'websocket' | 'mqtt' | 'dicom';
    vendor: string;
    version: string;
    status: 'active' | 'inactive' | 'error' | 'maintenance';
    lastSync?: Date;
    errorCount: number;
    lastError?: string;
    configuration: SystemConfiguration;
    statistics: SystemStatistics;
    createdAt: Date;
    updatedAt: Date;
}
export interface SystemConfiguration {
    endpoint: string;
    protocol: 'http' | 'https' | 'tcp' | 'udp' | 'file' | 'ftp' | 'sftp' | 'dicom';
    port?: number;
    authentication: AuthenticationConfig;
    headers?: Record<string, string>;
    parameters?: Record<string, any>;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    batchSize?: number;
    compression?: boolean;
    encryption?: EncryptionConfig;
    polling?: PollingConfig;
    mapping: FieldMapping[];
    validation: ValidationRule[];
    transformation?: TransformationRule[];
}
export interface AuthenticationConfig {
    type: 'none' | 'basic' | 'bearer' | 'oauth2' | 'api_key' | 'certificate' | 'saml' | 'jwt' | 'custom';
    credentials?: {
        username?: string;
        password?: string;
        token?: string;
        apiKey?: string;
        clientId?: string;
        clientSecret?: string;
        authorizationUrl?: string;
        tokenUrl?: string;
        refreshToken?: string;
        certificatePath?: string;
        privateKeyPath?: string;
        publicKey?: string;
        issuer?: string;
        audience?: string;
    };
    scopes?: string[];
    grantType?: string;
}
export interface EncryptionConfig {
    enabled: boolean;
    algorithm: 'AES-256-GCM' | 'AES-128-GCM' | 'RSA-OAEP' | 'custom';
    keyId?: string;
    keyManagement: 'local' | 'aws_kms' | 'azure_key_vault' | 'custom';
    keyPath?: string;
    iv?: string;
    tag?: string;
}
export interface PollingConfig {
    enabled: boolean;
    interval: number;
    strategy: 'fixed' | 'adaptive' | 'event_driven';
    maxIdleTime?: number;
    backoffStrategy?: 'exponential' | 'linear' | 'fixed';
    maxBackoff?: number;
}
export interface FieldMapping {
    sourceField: string;
    targetField: string;
    fieldType: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object' | 'reference';
    required: boolean;
    transformation?: string;
    validation?: string;
    defaultValue?: any;
    description?: string;
    unit?: string;
    format?: string;
    enumeration?: any[];
}
export interface ValidationRule {
    field: string;
    rule: string;
    errorMessage: string;
    severity: 'error' | 'warning' | 'info';
    customValidator?: string;
}
export interface TransformationRule {
    name: string;
    description: string;
    inputType: string;
    outputType: string;
    script?: string;
    function?: string;
    parameters?: Record<string, any>;
}
export interface SystemStatistics {
    totalMessages: number;
    successfulMessages: number;
    failedMessages: number;
    averageResponseTime: number;
    lastMessageTimestamp?: Date;
    dailyStats: DailyStats[];
    errorStats: ErrorStats[];
    performanceMetrics: PerformanceMetrics;
}
export interface DailyStats {
    date: string;
    messagesSent: number;
    messagesReceived: number;
    errors: number;
    averageResponseTime: number;
    dataVolume: number;
}
export interface ErrorStats {
    errorCode: string;
    errorMessage: string;
    count: number;
    firstOccurrence: Date;
    lastOccurrence: Date;
    resolved: boolean;
}
export interface PerformanceMetrics {
    throughput: number;
    latency: {
        p50: number;
        p95: number;
        p99: number;
        max: number;
    };
    availability: number;
    cpuUsage: number;
    memoryUsage: number;
}
export interface HL7Message {
    id: string;
    messageType: string;
    triggerEvent: string;
    messageControlId: string;
    processingId?: string;
    versionId?: string;
    sequenceNumber?: number;
    continuationPointer?: string;
    acceptanceAcknowledgement?: string;
    applicationAcknowledgement?: string;
    timestamp: Date;
    sender: string;
    receiver: string;
    processingStatus: 'received' | 'processing' | 'completed' | 'error' | 'rejected';
    segments: HL7Segment[];
    rawMessage: string;
    parsedData?: any;
    errors?: HL7Error[];
    metadata: HL7Metadata;
    createdAt: Date;
    updatedAt: Date;
}
export interface HL7Segment {
    segmentType: string;
    fields: HL7Field[];
    rawSegment: string;
}
export interface HL7Field {
    fieldNumber: number;
    component?: number;
    subComponent?: number;
    value: string;
    repetition?: number;
    type: string;
    description?: string;
}
export interface HL7Error {
    segmentType?: string;
    fieldNumber?: number;
    errorCode: string;
    errorMessage: string;
    severity: 'error' | 'warning' | 'info';
    recommendation?: string;
}
export interface HL7Metadata {
    encodingCharacters: string;
    processingRules: ProcessingRule[];
    acknowledgmentRules: AcknowledgmentRule[];
    customRules: CustomRule[];
}
export interface ProcessingRule {
    name: string;
    type: 'validation' | 'transformation' | 'routing' | 'enrichment';
    condition: string;
    action: string;
    enabled: boolean;
}
export interface AcknowledgmentRule {
    messageType: string;
    triggerEvent: string;
    responseCode: string;
    responseMessage: string;
    acknowledgments: string[];
    applicationLevel: boolean;
    commitLevel: boolean;
}
export interface CustomRule {
    name: string;
    description: string;
    script: string;
    enabled: boolean;
    parameters?: Record<string, any>;
}
export interface FHIRResource {
    id: string;
    resourceType: 'Patient' | 'Observation' | 'Condition' | 'Procedure' | 'Medication' | 'Encounter' | 'DiagnosticReport' | 'Organization' | 'Practitioner' | 'ServiceRequest';
    fhirVersion: string;
    apiEndpoint: string;
    resourceId: string;
    versionId?: string;
    lastUpdated?: Date;
    sourceSystem: string;
    processingStatus: 'received' | 'created' | 'updated' | 'deleted' | 'error' | 'pending' | 'completed';
    validationStatus: 'valid' | 'invalid' | 'warnings';
    resource: any;
    extensions: FHIRExtension[];
    identifiers: FHIRIdentifier[];
    containedResources?: FHIRResource[];
    bundle?: FHIRBundle;
    rawResource: string;
    parsedResource?: any;
    errors?: FHIRValidationError[];
    metadata: FHIRMetadata;
    createdAt: Date;
    updatedAt: Date;
}
export interface FHIRBundle {
    id: string;
    type: 'collection' | 'document' | 'message' | 'transaction' | 'batch' | 'searchset' | 'history' | 'vread' | 'operation';
    resourceType: 'Bundle';
    timestamp?: Date;
    total?: number;
    link?: FHIRLink[];
    entry: FHIRBundleEntry[];
    signature?: FHIRSignature;
}
export interface FHIRBundleEntry {
    fullUrl?: string;
    resource?: FHIRResource;
    search?: FHIRBundleEntrySearch;
    request?: FHIRBundleEntryRequest;
    response?: FHIRBundleEntryResponse;
}
export interface FHIRBundleEntrySearch {
    mode?: 'match' | 'include' | 'outcome';
    score?: number;
}
export interface FHIRBundleEntryRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    ifNoneMatch?: string;
    ifMatch?: string;
    ifModifiedSince?: string;
    ifNoneExist?: string;
}
export interface FHIRBundleEntryResponse {
    status: string;
    location?: string;
    etag?: string;
    lastModified?: Date;
    outcome?: FHIROperationOutcome;
}
export interface FHIROperationOutcome {
    resourceType: 'OperationOutcome';
    id?: string;
    issue?: FHIRIssue[];
}
export interface FHIRIssue {
    severity: 'fatal' | 'error' | 'warning' | 'information';
    code: string;
    details?: {
        coding?: FHIRCoding[];
        text?: string;
    };
    diagnostics?: string;
    location?: string;
    expression?: string;
}
export interface FHIRExtension {
    url: string;
    value?: any;
    extension?: FHIRExtension[];
}
export interface FHIRIdentifier {
    use?: string;
    type?: FHIRCodeableConcept;
    system: string;
    value: string;
    period?: FHIRPeriod;
    assigner?: FHIRReference;
}
export interface FHIRReference {
    reference: string;
    type?: string;
    identifier?: FHIRIdentifier;
    display?: string;
}
export interface FHIRLink {
    relation: 'self' | 'first' | 'next' | 'last' | 'previous';
    url: string;
}
export interface FHIRSignature {
    type: FHIRCodeableConcept[];
    when: FHIRInstant;
    who: FHIRReference;
    onBehalfOf?: FHIRReference;
    targetFormat?: string[];
    sigFormat: string;
    data?: string;
    contentType: string;
}
export interface FHIRCodeableConcept {
    coding?: FHIRCoding[];
    text?: string;
}
export interface FHIRCoding {
    system?: string;
    version?: string;
    code?: string;
    display?: string;
    userSelected?: boolean;
}
export interface FHIRPeriod {
    start?: string;
    end?: string;
}
export interface FHIRInstant {
    value?: string;
}
export interface FHIRMetadata {
    profile: string[];
    security?: string[];
    tag?: FHIRTag[];
    meta?: FHIRMeta;
}
export interface FHIRTag {
    system: string;
    code: string;
    display?: string;
    version?: string;
}
export interface FHIRMeta {
    versionId?: string;
    lastUpdated?: string;
    source?: string;
    profile?: string[];
    security?: string[];
    tag?: FHIRTag[];
}
export interface FHIRValidationError {
    element: string;
    path: string;
    constraint?: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
}
export interface IntegrationEvent {
    id: string;
    eventType: 'message_received' | 'message_sent' | 'transformation_started' | 'transformation_completed' | 'validation_failed' | 'routing_completed' | 'error_occurred';
    systemId: string;
    messageId?: string;
    timestamp: Date;
    payload: any;
    metadata: IntegrationEventMetadata;
    status: 'success' | 'warning' | 'error';
    duration?: number;
    processedBy: string;
}
export interface IntegrationEventMetadata {
    source: string;
    destination?: string;
    correlationId?: string;
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    retryCount?: number;
    version?: string;
    environment?: string;
    tags?: Record<string, string>;
}
export interface IntegrationWorkflow {
    id: string;
    name: string;
    description: string;
    type: 'inbound' | 'outbound' | 'bi_directional';
    trigger: WorkflowTrigger;
    steps: WorkflowStep[];
    status: 'active' | 'inactive' | 'error';
    configuration?: WorkflowConfiguration;
    statistics: WorkflowStatistics;
    createdAt: Date;
    updatedAt: Date;
}
export interface WorkflowTrigger {
    type: 'event' | 'schedule' | 'manual' | 'api_call';
    condition: string;
    parameters?: Record<string, any>;
    schedule?: string;
}
export interface WorkflowStep {
    id: string;
    name: string;
    type: 'receive' | 'transform' | 'validate' | 'route' | 'send' | 'store' | 'notify' | 'branch' | 'merge';
    order: number;
    configuration: any;
    conditions?: string[];
    timeout?: number;
    retryPolicy: RetryPolicy;
    errorHandling: ErrorHandling;
}
export interface WorkflowConfiguration {
    parallel: boolean;
    transactional: boolean;
    rollbackOnFailure: boolean;
    logging: {
        enabled: boolean;
        level: 'debug' | 'info' | 'warn' | 'error';
        detailed: boolean;
    };
    monitoring: {
        enabled: boolean;
        alerts: boolean;
        metrics: boolean;
    };
}
export interface WorkflowStatistics {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageExecutionTime: number;
    lastExecutionDate?: Date;
    executionHistory: ExecutionRecord[];
}
export interface ExecutionRecord {
    id: string;
    workflowId: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    input: any;
    output?: any;
    errors?: WorkflowError[];
    steps: StepExecution[];
}
export interface StepExecution {
    stepId: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startTime: Date;
    endTime?: Date;
    duration?: number;
    input?: any;
    output?: any;
    error?: string;
}
export interface WorkflowError {
    stepId: string;
    errorType: string;
    errorMessage: string;
    errorCode?: string;
    stackTrace?: string;
    timestamp: Date;
    resolved: boolean;
    resolution?: string;
}
export interface RetryPolicy {
    maxAttempts: number;
    backoffStrategy: 'fixed' | 'exponential' | 'linear';
    backoffMultiplier?: number;
    maxBackoff?: number;
    retryableErrors?: string[];
    nonRetryableErrors?: string[];
}
export interface ErrorHandling {
    strategy: 'fail' | 'retry' | 'skip' | 'notify' | 'custom';
    maxRetries?: number;
    alertOnFailure?: boolean;
    customHandler?: string;
}
export interface IntegrationHealth {
    systemId: string;
    status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
    lastCheck: Date;
    responseTime?: number;
    uptime?: number;
    errorRate?: number;
    throughput?: number;
    queueDepth?: number;
    lastError?: string;
    checks: HealthCheck[];
    recommendations?: string[];
}
export interface HealthCheck {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
    timestamp: Date;
    responseTime?: number;
    details?: Record<string, any>;
}
export interface DataMapping {
    id: string;
    name: string;
    description: string;
    sourceSystem: string;
    targetSystem: string;
    sourceFormat: 'hl7_v2' | 'hl7_v3' | 'fhir_r4' | 'fhir_stu3' | 'fhir_dstu2' | 'custom_xml' | 'custom_json' | 'csv' | 'fixed_width' | 'delimited';
    targetFormat: 'hl7_v2' | 'hl7_v3' | 'fhir_r4' | 'fhir_stu3' | 'fhir_dstu2' | 'custom_xml' | 'custom_json' | 'csv' | 'fixed_width' | 'delimited';
    mappings: MappingRule[];
    transformations: TransformationScript[];
    validation: ValidationScript[];
    version: string;
    status: 'active' | 'inactive' | 'testing';
    statistics: MappingStatistics;
    createdAt: Date;
    updatedAt: Date;
}
export interface MappingRule {
    id: string;
    sourcePath: string;
    targetPath: string;
    dataType: string;
    required: boolean;
    defaultValue?: any;
    transformation?: string;
    validation?: string;
    description?: string;
    examples?: any[];
}
export interface TransformationScript {
    id: string;
    name: string;
    description: string;
    language: 'javascript' | 'python' | 'sql' | 'custom';
    script: string;
    inputSchema?: any;
    outputSchema?: any;
    tests: TransformationTest[];
    version: string;
    status: 'active' | 'inactive' | 'testing';
}
export interface ValidationScript {
    id: string;
    name: string;
    description: string;
    rule: string;
    language: 'javascript' | 'json_schema' | 'schematron' | 'custom';
    script?: string;
    schema?: any;
    severity: 'error' | 'warning' | 'info';
    status: 'active' | 'inactive';
}
export interface MappingStatistics {
    totalMappings: number;
    successfulMappings: number;
    failedMappings: number;
    averageProcessingTime: number;
    dataVolume: number;
    lastUsage?: Date;
}
export interface TransformationTest {
    name: string;
    description: string;
    input: any;
    expectedOutput: any;
    actualOutput?: any;
    passed: boolean;
    error?: string;
    createdAt: Date;
}
export interface IntegrationLog {
    id: string;
    systemId: string;
    eventType: string;
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    message: string;
    payload?: any;
    context: LogContext;
    timestamp: Date;
    correlationId?: string;
    userId?: string;
    sessionId?: string;
    duration?: number;
    stackTrace?: string;
    tags?: Record<string, string>;
}
export interface LogContext {
    source: string;
    destination?: string;
    protocol?: string;
    method?: string;
    endpoint?: string;
    requestId?: string;
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    environment: string;
    version?: string;
}
export interface IntegrationAudit {
    id: string;
    auditType: 'access' | 'modification' | 'data_transfer' | 'error' | 'security' | 'compliance';
    systemId: string;
    userId?: string;
    timestamp: Date;
    action: string;
    resource: string;
    oldValues?: any;
    newValues?: any;
    outcome: 'success' | 'failure' | 'partial';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    complianceIssues?: ComplianceIssue[];
    metadata: AuditMetadata;
}
export interface ComplianceIssue {
    rule: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    category: 'privacy' | 'security' | 'data_quality' | 'access_control' | 'audit_trail';
    affectedResources: string[];
    remediation?: string;
    deadline?: Date;
}
export interface AuditMetadata {
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
    sessionId?: string;
    environment: string;
    version?: string;
    tags?: Record<string, string>;
    additionalInfo?: Record<string, any>;
}
