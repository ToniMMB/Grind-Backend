export class GamificationUtil {
  /**
   * Calcula el nivel basado en XP total
   */
  static calculateLevel(xp: number): number {
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
  static xpForNextLevel(currentLevel: number): number {
    return Math.floor(100 * Math.pow(1.5, currentLevel));
  }

  /**
   * Calcula XP total acumulado hasta cierto nivel
   */
  static xpForLevel(level: number): number {
    let totalXp = 0;
    for (let i = 1; i < level; i++) {
      totalXp += Math.floor(100 * Math.pow(1.5, i));
    }
    return totalXp;
  }

  /**
   * Verifica si el usuario subió de nivel
   */
  static checkLevelUp(oldXp: number, newXp: number): boolean {
    const oldLevel = this.calculateLevel(oldXp);
    const newLevel = this.calculateLevel(newXp);
    return newLevel > oldLevel;
  }

  /**
   * Calcula días entre dos fechas
   */
  static daysBetween(date1: string | Date, date2: string | Date): number {
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
  static calculateXPForMinutes(minutes: number): number {
    return Math.floor(minutes * 10);
  }

  /**
   * Calcula XP por completar una tarea
   */
  static calculateXPForTask(): number {
    return 50;
  }

  /**
   * Bonus XP por alcanzar meta diaria
   */
  static calculateXPForDailyGoal(): number {
    return 200;
  }

  /**
   * Calcula XP para bloques DO según nueva fórmula V3
   * XP_FINAL = (XP_BASE × % cumplimiento) - (breaks × 10 XP)
   */
  static calculateBlockXP(
    plannedDuration: number, // minutos planeados
    actualDuration: number,  // minutos realmente enfocado
    breaks: number           // número de breaks tomados
  ): number {
    const XP_BASE_PER_HOUR = 100;
    const XP_PENALTY_PER_BREAK = 10;
    
    const hours = plannedDuration / 60;
    const xpBase = XP_BASE_PER_HOUR * hours;
    
    const completionPercentage = actualDuration / plannedDuration;
    
    const xpFromCompletion = xpBase * completionPercentage;
    const xpPenalty = breaks * XP_PENALTY_PER_BREAK;
    
    return Math.max(0, Math.round(xpFromCompletion - xpPenalty));
  }

  /**
   * Calcula XP para bloques DONT (honor system)
   */
  static calculateDontBlockXP(completed: boolean, hasPhoto: boolean): number {
    const BASE_XP = 100;
    const PHOTO_BONUS = 50;
    
    if (!completed) return 0;
    
    return BASE_XP + (hasPhoto ? PHOTO_BONUS : 0);
  }
}

