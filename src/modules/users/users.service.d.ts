import { UpdateProfileInput, UpdateSettingsInput } from './users.validation.js';
export declare class UsersService {
    getProfile(userId: string): Promise<{
        settings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            pushEnabled: boolean;
            hapticEnabled: boolean;
            soundEnabled: boolean;
            darkMode: boolean;
            userId: string;
        } | null;
        name: string | null;
        id: string;
        email: string;
        avatar: string | null;
        level: number;
        xp: number;
        currentStreak: number;
        longestStreak: number;
        lastActiveDate: Date | null;
        dailyGoalMinutes: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, data: UpdateProfileInput): Promise<{
        settings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            pushEnabled: boolean;
            hapticEnabled: boolean;
            soundEnabled: boolean;
            darkMode: boolean;
            userId: string;
        } | null;
        name: string | null;
        id: string;
        email: string;
        avatar: string | null;
        level: number;
        xp: number;
        currentStreak: number;
        longestStreak: number;
        lastActiveDate: Date | null;
        dailyGoalMinutes: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSettings(userId: string, data: UpdateSettingsInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pushEnabled: boolean;
        hapticEnabled: boolean;
        soundEnabled: boolean;
        darkMode: boolean;
        userId: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=users.service.d.ts.map