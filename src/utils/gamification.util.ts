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
}

