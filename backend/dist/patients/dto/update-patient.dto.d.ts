import { CreatePatientDto } from './create-patient.dto';
declare const UpdatePatientDto_base: import("@nestjs/common").Type<Partial<CreatePatientDto>>;
export declare class UpdatePatientDto extends UpdatePatientDto_base {
    name?: string;
    treatmentStatus?: 'new' | 'ongoing' | 'completed' | 'palliative' | 'lost_to_followup' | 'deceased';
    isDeceased?: boolean;
    dateOfDeath?: Date;
    causeOfDeath?: string;
}
export {};
