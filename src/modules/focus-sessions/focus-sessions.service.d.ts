import { StartSessionInput, QuerySessionsInput } from './focus-sessions.validation.js';
export declare class FocusSessionsService {
    startSession(userId: string, data: StartSessionInput): Promise<{
        status: import(".prisma/client").$Enums.SessionStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        focusBlockId: string | null;
        plannedDuration: number;
        actualDuration: number | null;
        pausedAt: Date | null;
        totalPaused: number;
        xpEarned: number;
    }>;
    getActiveSession(userId: string): Promise<{
        elapsed: number;
        focusBlock: {
            type: import(".prisma/client").$Enums.BlockType;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            icon: string | null;
            color: string | null;
            startTime: string;
            endTime: string;
            daysOfWeek: number[];
            isActive: boolean;
        } | null;
        status: import(".prisma/client").$Enums.SessionStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        focusBlockId: string | null;
        plannedDuration: number;
        actualDuration: number | null;
        pausedAt: Date | null;
        totalPaused: number;
        xpEarned: number;
    } | null>;
    pauseSession(id: string, userId: string): Promise<{
        status: import(".prisma/client").$Enums.SessionStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        focusBlockId: string | null;
        plannedDuration: number;
        actualDuration: number | null;
        pausedAt: Date | null;
        totalPaused: number;
        xpEarned: number;
    }>;
    resumeSession(id: string, userId: string): Promise<{
        status: import(".prisma/client").$Enums.SessionStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        focusBlockId: string | null;
        plannedDuration: number;
        actualDuration: number | null;
        pausedAt: Date | null;
        totalPaused: number;
        xpEarned: number;
    }>;
    completeSession(id: string, userId: string): Promise<{
        session: {
            status: import(".prisma/client").$Enums.SessionStatus;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            startTime: Date;
            endTime: Date | null;
            focusBlockId: string | null;
            plannedDuration: number;
            actualDuration: number | null;
            pausedAt: Date | null;
            totalPaused: number;
            xpEarned: number;
        };
        user: {
            level: number;
            xp: number;
            currentStreak: number;
            leveledUp: boolean;
        };
    }>;
    cancelSession(id: string, userId: string): Promise<{
        status: import(".prisma/client").$Enums.SessionStatus;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        focusBlockId: string | null;
        plannedDuration: number;
        actualDuration: number | null;
        pausedAt: Date | null;
        totalPaused: number;
        xpEarned: number;
    }>;
    getSessions(userId: string, query: QuerySessionsInput): Promise<{
        sessions: ({
            focusBlock: {
                type: import(".prisma/client").$Enums.BlockType;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                description: string | null;
                icon: string | null;
                color: string | null;
                startTime: string;
                endTime: string;
                daysOfWeek: number[];
                isActive: boolean;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.SessionStatus;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            startTime: Date;
            endTime: Date | null;
            focusBlockId: string | null;
            plannedDuration: number;
            actualDuration: number | null;
            pausedAt: Date | null;
            totalPaused: number;
            xpEarned: number;
        })[];
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    }>;
    private updateStreak;
    private updateDailyStatistics;
}
//# sourceMappingURL=focus-sessions.service.d.ts.map