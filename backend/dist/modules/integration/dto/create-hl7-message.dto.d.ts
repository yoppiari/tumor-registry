export declare class CreateHL7MessageDto {
    messageType: 'ADT' | 'ORU' | 'ORM';
    message: string;
    timestamp?: string;
    sendingFacility?: string;
    receivingFacility?: string;
}
