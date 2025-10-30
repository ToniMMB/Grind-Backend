import { QueryProgressInput, QueryHeatmapInput } from './statistics.validation.js';
export declare class StatisticsService {
    getDashboard(userId: string): Promise<any>;
    getProgress(userId: string, query: QueryProgressInput): Promise<{
        summary: {
            totalMinutes: number;
            totalSessions: number;
            tasksCompleted: number;
            completionRate: number;
            currentStreak: number;
            longestStreak: number;
            level: number;
            xp: number;
            xpForNextLevel: number;
        };
        dailyBreakdown: {
            date: string;
            dayOfWeek: string;
            minutes: number;
            sessionsCount: number;
            tasksCompleted: number;
            goalReached: boolean;
        }[];
        weeklyActivity: {
            labels: string[];
            data: any[];
        };
        bestDay: {
            date: string;
            minutes: number;
        } | null;
        bestTime: string;
    }>;
    getHeatmap(userId: string, query: QueryHeatmapInput): Promise<{
        heatmap: {
            date: string;
            minutes: number;
            level: string;
            sessionsCount: number;
        }[];
        monthSummary: {
            totalMinutes: number;
            daysActive: number;
            averagePerDay: number;
        };
    }>;
    private getHeatmapLevel;
    private calculateBestTime;
}
//# sourceMappingURL=statistics.service.d.ts.map