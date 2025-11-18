export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    centerId?: string;
    iat?: number;
    exp?: number;
}
