"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
    dailyGoalMinutes: zod_1.z.number().min(1).max(1440).optional(),
});
exports.updateSettingsSchema = zod_1.z.object({
    pushEnabled: zod_1.z.boolean().optional(),
    hapticEnabled: zod_1.z.boolean().optional(),
    soundEnabled: zod_1.z.boolean().optional(),
    darkMode: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=users.validation.js.map