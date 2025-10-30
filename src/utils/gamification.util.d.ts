export declare class GamificationUtil {
    /**
     * Calcula el nivel basado en XP total
     */
    static calculateLevel(xp: number): number;
    /**
     * Calcula XP necesario para el siguiente nivel
     */
    static xpForNextLevel(currentLevel: number): number;
    /**
     * Calcula XP total acumulado hasta cierto nivel
     */
    static xpForLevel(level: number): number;
    /**
     * Verifica si el usuario subió de nivel
     */
    static checkLevelUp(oldXp: number, newXp: number): boolean;
    /**
     * Calcula días entre dos fechas
     */
    static daysBetween(date1: string | Date, date2: string | Date): number;
    /**
     * Calcula XP ganado por minutos de focus
     */
    static calculateXPForMinutes(minutes: number): number;
    /**
     * Calcula XP por completar una tarea
     */
    static calculateXPForTask(): number;
    /**
     * Bonus XP por alcanzar meta diaria
     */
    static calculateXPForDailyGoal(): number;
}
//# sourceMappingURL=gamification.util.d.ts.map