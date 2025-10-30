import { CreateTaskInput, UpdateTaskInput, QueryTasksInput, ReorderTasksInput } from './tasks.validation.js';
export declare class TasksService {
    getTasks(userId: string, query: QueryTasksInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        title: string;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        category: string | null;
        completed: boolean;
        order: number;
        completedAt: Date | null;
    }[]>;
    getTaskById(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        title: string;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        category: string | null;
        completed: boolean;
        order: number;
        completedAt: Date | null;
    }>;
    createTask(userId: string, data: CreateTaskInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        title: string;
        priority: import(".prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        category: string | null;
        completed: boolean;
        order: number;
        completedAt: Date | null;
    }>;
    updateTask(id: string, userId: string, data: UpdateTaskInput): Promise<{
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            title: string;
            priority: import(".prisma/client").$Enums.TaskPriority;
            dueDate: Date | null;
            category: string | null;
            completed: boolean;
            order: number;
            completedAt: Date | null;
        };
        user: {
            level: number;
            xp: number;
            leveledUp: boolean;
        } | undefined;
    } | {
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            title: string;
            priority: import(".prisma/client").$Enums.TaskPriority;
            dueDate: Date | null;
            category: string | null;
            completed: boolean;
            order: number;
            completedAt: Date | null;
        };
        user?: undefined;
    }>;
    deleteTask(id: string, userId: string): Promise<{
        message: string;
    }>;
    reorderTasks(userId: string, data: ReorderTasksInput): Promise<{
        message: string;
    }>;
    private grantTaskCompletionReward;
    private updateDailyStatistics;
}
//# sourceMappingURL=tasks.service.d.ts.map