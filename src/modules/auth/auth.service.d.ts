import { RegisterInput, LoginInput } from './auth.validation.js';
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            level: number;
            xp: number;
        };
    }>;
    login(data: LoginInput): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            level: number;
            xp: number;
            currentStreak: number;
            longestStreak: number;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map