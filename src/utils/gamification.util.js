"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationUtil = void 0;
class GamificationUtil {
    /**
     * Calcula el nivel basado en XP total
     */
    static calculateLevel(xp) {
        let level = 1;
        let xpRequired = 100;
        let totalXpForLevel = 0;
        while (xp >= totalXpForLevel + xpRequired) {
            totalXpForLevel += xpRequired;
            level++;
            xpRequired = Math.floor(100 * Math.pow(1.5, level - 1));
        }
        return level;
    }
    /**
     * Calcula XP necesario para el siguiente nivel
     */
    static xpForNextLevel(currentLevel) {
        return Math.floor(100 * Math.pow(1.5, currentLevel));
    }
    /**
     * Calcula XP total acumulado hasta cierto nivel
     */
    static xpForLevel(level) {
        let totalXp = 0;
        for (let i = 1; i < level; i++) {
            totalXp += Math.floor(100 * Math.pow(1.5, i));
        }
        return totalXp;
    }
    /**
     * Verifica si el usuario subió de nivel
     */
    static checkLevelUp(oldXp, newXp) {
        const oldLevel = this.calculateLevel(oldXp);
        const newLevel = this.calculateLevel(newXp);
        return newLevel > oldLevel;
    }
    /**
     * Calcula días entre dos fechas
     */
    static daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    /**
     * Calcula XP ganado por minutos de focus
     */
    static calculateXPForMinutes(minutes) {
        return Math.floor(minutes * 10);
    }
    /**
     * Calcula XP por completar una tarea
     */
    static calculateXPForTask() {
        return 50;
    }
    /**
     * Bonus XP por alcanzar meta diaria
     */
    static calculateXPForDailyGoal() {
        return 200;
    }
}
exports.GamificationUtil = GamificationUtil;
//# sourceMappingURL=gamification.util.js.map