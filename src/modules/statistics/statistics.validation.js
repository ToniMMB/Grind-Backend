"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryHeatmapSchema = exports.queryProgressSchema = void 0;
const zod_1 = require("zod");
exports.queryProgressSchema = zod_1.z.object({
    period: zod_1.z.enum(['week', 'month']).default('month'),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
exports.queryHeatmapSchema = zod_1.z.object({
    year: zod_1.z.string().transform(Number).optional(),
    month: zod_1.z.string().transform(val => {
        const num = Number(val);
        if (num < 1 || num > 12)
            throw new Error('Month must be between 1 and 12');
        return num;
    }).optional(),
});
//# sourceMappingURL=statistics.validation.js.map