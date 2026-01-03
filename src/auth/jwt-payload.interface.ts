// src/auth/jwt-payload.interface.ts
export interface JwtPayload {
  id: number;
  email: string;
  role: 'HRD' | 'EMPLOYEE';
}
