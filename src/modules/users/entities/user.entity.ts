export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
