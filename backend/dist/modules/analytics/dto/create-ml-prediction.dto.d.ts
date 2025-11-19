export declare class CreateMLPredictionDto {
    patientId: string;
    treatmentPlanId: string;
    predictionType: 'survival' | 'response' | 'toxicity';
    features?: any;
}
