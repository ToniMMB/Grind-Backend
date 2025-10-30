"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryFocusBlocksSchema = exports.updateFocusBlockSchema = exports.createFocusBlockSchema = void 0;
const zod_1 = require("zod");
// Validar formato HH:mm
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
exports.createFocusBlockSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name must be at least 3 characters').max(100),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    startTime: zod_1.z.string().regex(timeRegex, 'Invalid time format. Use HH:mm'),
    endTime: zod_1.z.string().regex(timeRegex, 'Invalid time format. Use HH:mm'),
    daysOfWeek: zod_1.z.array(zod_1.z.number().min(0).max(6)).min(1, 'At least one day must be selected'),
}).refine((data) => {
    // Validar que endTime sea después de startTime
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes > startMinutes;
}, {
    message: 'End time must be after start time',
    path: ['endTime'],
});
exports.updateFocusBlockSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100).optional(),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    startTime: zod_1.z.string().regex(timeRegex, 'Invalid time format. Use HH:mm').optional(),
    endTime: zod_1.z.string().regex(timeRegex, 'Invalid time format. Use HH:mm').optional(),
    daysOfWeek: zod_1.z.array(zod_1.z.number().min(0).max(6)).min(1).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.queryFocusBlocksSchema = zod_1.z.object({
    type: zod_1.z.enum(['PREDEFINED', 'CUSTOM', 'ALL']).optional(),
    active: zod_1.z.string().transform(val => val === 'true').optional(),
});
//# sourceMappingURL=focus-blocks.validation.js.map