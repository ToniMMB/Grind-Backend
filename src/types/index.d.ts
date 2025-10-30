import { Request } from 'express';
import { User } from '@prisma/client';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginationParams {
    limit: number;
    offset: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}
export type UserPublic = Omit<User, 'password'>;
export interface TokenPayload {
    userId: string;
    email: string;
}
export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
//# sourceMappingURL=index.d.ts.map