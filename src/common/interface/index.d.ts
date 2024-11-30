// import { Schema } from 'mongoose';
import { User, UserRoles } from 'src/user/entities/user.entity';
import { Request } from 'express';

type ShallowCopy<T> = {
  [P in keyof T]?: T[P]; // Make all properties optional to allow subtractions
} & {
  [key: string]: any; // Allow additional properties
};

export interface JwtPayload {
  username: string;
  role: UserRoles;
  sub: string;
}

export interface AuthResponse {
  id?: string;
  user: ShallowCopy<User>;
  role: UserRoles;
  access_token: string;
}

export interface IRequest extends Request {
  user: User;
}
