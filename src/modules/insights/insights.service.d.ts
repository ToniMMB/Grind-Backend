import { QueryInsightsInput } from './insights.validation.js';
export declare class InsightsService {
    getInsights(userId: string, query: QueryInsightsInput): Promise<{
        message: string;
        type: import(".prisma/client").$Enums.InsightType;
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        priority: number;
        isRead: boolean;
        validFrom: Date;
        validUntil: Date | null;
    }[]>;
    generateInsights(userId: string): Promise<{
        insights: {
            message: string;
            type: import(".prisma/client").$Enums.InsightType;
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            priority: number;
            isRead: boolean;
            validFrom: Date;
            validUntil: Date | null;
        }[];
        message: string;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        message: string;
        type: import(".prisma/client").$Enums.InsightType;
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        priority: number;
        isRead: boolean;
        validFrom: Date;
        validUntil: Date | null;
    }>;
    deleteInsight(id: string, userId: string): Promise<{
        message: string;
    }>;
    checkAndGrantAchievements(userId: string): Promise<number | undefined>;
    private calculateConsistency;
    private calculateBestTime;
}
//# sourceMappingURL=insights.service.d.ts.map