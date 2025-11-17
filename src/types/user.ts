// src/types/user.ts
export type UserRole = 'estudiante' | 'staff' | 'autoridad';

export interface User {
  id: string;      // user_id de Dynamo
  name: string;    // "Nombre Apellido"
  email: string;   // correo institucional (tenant_id)
  role: UserRole;
}
