export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: string;
  centerId?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}