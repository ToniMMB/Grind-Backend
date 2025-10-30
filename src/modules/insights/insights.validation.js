"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryInsightsSchema = void 0;
const zod_1 = require("zod");
exports.queryInsightsSchema = zod_1.z.object({
    type: zod_1.z.enum(['IMPROVEMENT_TIP', 'BEST_TIME', 'CONSISTENCY', 'ACHIEVEMENT', 'RECOMMENDATION']).optional(),
    unread: zod_1.z.string().transform(val => val === 'true').optional(),
    limit: zod_1.z.string().transform(Number).default('10'),
});
//# sourceMappingURL=insights.validation.js.map