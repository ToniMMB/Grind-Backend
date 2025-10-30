import { CreateFocusBlockInput, UpdateFocusBlockInput, QueryFocusBlocksInput } from './focus-blocks.validation.js';
export declare class FocusBlocksService {
    getFocusBlocks(userId: string, query: QueryFocusBlocksInput): Promise<{
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
    }[]>;
    getFocusBlockById(id: string, userId: string): Promise<{
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
    }>;
    createFocusBlock(userId: string, data: CreateFocusBlockInput): Promise<{
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
    }>;
    updateFocusBlock(id: string, userId: string, data: UpdateFocusBlockInput): Promise<{
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
    }>;
    deleteFocusBlock(id: string, userId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=focus-blocks.service.d.ts.map