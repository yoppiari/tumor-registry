export declare enum UserRole {
    DATA_ENTRY = "data_entry",
    RESEARCHER = "researcher",
    ADMIN = "admin",
    NATIONAL_STAKEHOLDER = "national_stakeholder"
}
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone?: string;
    centerId?: string;
}
