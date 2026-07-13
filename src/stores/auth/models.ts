export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  name: string;
}
