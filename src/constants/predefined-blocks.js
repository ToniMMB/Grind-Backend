"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREDEFINED_BLOCKS = void 0;
// Bloques predefinidos que se crean automáticamente al registrar un usuario
exports.PREDEFINED_BLOCKS = [
    {
        name: "Enfoque láser",
        description: "Tu hora diaria de enfoque de 2 a 3 pm, de lunes a viernes",
        icon: "🎯",
        type: "PREDEFINED",
        startTime: "14:00",
        endTime: "15:00",
        daysOfWeek: [1, 2, 3, 4, 5],
    },
    {
        name: "Levántate y brilla",
        description: "Despiértate sin distracciones de 6 a 9 am todos los días",
        icon: "☀️",
        type: "PREDEFINED",
        startTime: "06:00",
        endTime: "09:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
    {
        name: "Relajación",
        description: "Un buen sueño empieza antes de acostarte, de 8pm a 10pm",
        icon: "☕",
        type: "PREDEFINED",
        startTime: "20:00",
        endTime: "22:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
];
//# sourceMappingURL=predefined-blocks.js.map