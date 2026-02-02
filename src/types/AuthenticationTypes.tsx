export type UserRole = 'admin' | 'seller' | 'buyer';

export interface User {
  id: number | string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type CreateUser = Omit<User, 'id'>;

export type LoginForm = Pick<User, 'email' | 'password'>;