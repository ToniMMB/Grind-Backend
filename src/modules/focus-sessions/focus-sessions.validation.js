"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySessionsSchema = exports.startSessionSchema = void 0;
const zod_1 = require("zod");
exports.startSessionSchema = zod_1.z.object({
    focusBlockId: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    plannedDuration: zod_1.z.number().min(1, 'Duration must be at least 1 minute').max(1440),
});
exports.querySessionsSchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    status: zod_1.z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED']).optional(),
    limit: zod_1.z.string().transform(Number).optional(),
    offset: zod_1.z.string().transform(Number).optional(),
});
//# sourceMappingURL=focus-sessions.validation.js.map