/**
 * Utilidades para el sistema de racha según documento V3
 */

export type StreakStatus = 'increase' | 'maintain' | 'break';

export interface BlockCompletion {
  completed: boolean;
  completionPercentage: number; // 0-100
}

/**
 * Calcula el estado de la racha basado en los bloques completados del día
 * 
 * Reglas:
 * - ≤6 bloques: Se evalúa el peor bloque
 * - >6 bloques: Se evalúa el promedio
 * 
 * Umbrales:
 * - 100%: Racha +1
 * - 70-99%: Racha continúa
 * - <70%: Racha se rompe
 */
export function calculateStreakStatus(blocksToday: BlockCompletion[]): StreakStatus {
  // Si no hay bloques, mantener racha (día sin bloques planificados)
  if (blocksToday.length === 0) {
    return 'maintain';
  }

  // Filtrar solo bloques que fueron ejecutados (completed = true)
  const executedBlocks = blocksToday.filter(b => b.completed);

  // Si hay bloques planificados pero ninguno ejecutado
  if (executedBlocks.length === 0) {
    return 'break';
  }

  if (blocksToday.length <= 6) {
    // Evaluar el peor bloque
    const worstCompletion = Math.min(...executedBlocks.map(b => b.completionPercentage));
    
    if (worstCompletion >= 100) return 'increase';
    if (worstCompletion >= 70) return 'maintain';
    return 'break';
  } else {
    // Evaluar promedio de todos los bloques
    const avgCompletion = 
      executedBlocks.reduce((sum, b) => sum + b.completionPercentage, 0) / executedBlocks.length;
    
    if (avgCompletion >= 70) return 'maintain';
    return 'break';
  }
}

/**
 * Actualiza la racha del usuario basado en el status calculado
 */
export function updateUserStreak(
  currentStreak: number,
  longestStreak: number,
  status: StreakStatus
): { newStreak: number; newLongest: number } {
  let newStreak = currentStreak;
  let newLongest = longestStreak;

  switch (status) {
    case 'increase':
      newStreak = currentStreak + 1;
      newLongest = Math.max(newStreak, longestStreak);
      break;
    case 'maintain':
      // Racha no cambia
      break;
    case 'break':
      newStreak = 0;
      break;
  }

  return { newStreak, newLongest };
}

/**
 * Verifica si dos fechas son días consecutivos
 */
export function areConsecutiveDays(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
}

