import prisma from '../../config/database.js';
import { ApiError } from '../../middlewares/error.middleware.js';
import { GamificationUtil } from '../../utils/gamification.util.js';
import { CreateTaskInput, UpdateTaskInput, QueryTasksInput, ReorderTasksInput } from './tasks.validation.js';

export class TasksService {
  async getTasks(userId: string, query: QueryTasksInput) {
    const where: any = { userId };

    if (query.completed !== undefined) {
      where.completed = query.completed;
    }

    if (query.category) {
      where.category = query.category;
    }

    const orderByMap: any = {
      createdAt: { createdAt: query.order },
      dueDate: { dueDate: query.order },
      priority: { priority: query.order },
      order: { order: query.order },
    };

    const tasks = await prisma.task.findMany({
      where,
      orderBy: orderByMap[query.sortBy] || { createdAt: 'asc' },
    });

    return tasks;
  }

  async getTaskById(id: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new ApiError('Task not found', 404);
    }

    return task;
  }

  async createTask(userId: string, data: CreateTaskInput) {
    // Obtener el orden más alto actual
    const maxOrderTask = await prisma.task.findFirst({
      where: { userId, completed: false },
      orderBy: { order: 'desc' },
    });

    const nextOrder = (maxOrderTask?.order ?? -1) + 1;

    const task = await prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        category: data.category,
        order: nextOrder,
      },
    });

    return task;
  }

  async updateTask(id: string, userId: string, data: UpdateTaskInput) {
    // Verificar que la tarea existe y pertenece al usuario
    const existingTask = await this.getTaskById(id, userId);

    // Si se está marcando como completada
    if (data.completed === true && !existingTask.completed) {
      const task = await prisma.task.update({
        where: { id },
        data: {
          ...data,
          completedAt: new Date(),
        },
      });

      // Otorgar XP
      await this.grantTaskCompletionReward(userId);

      // Actualizar estadísticas diarias
      await this.updateDailyStatistics(userId, new Date(), {
        addTask: true,
        addXP: GamificationUtil.calculateXPForTask(),
      });

      // Verificar nivel
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const leveledUp = user ? GamificationUtil.checkLevelUp(
        user.xp - GamificationUtil.calculateXPForTask(),
        user.xp
      ) : false;

      return { task, user: user ? {
        level: user.level,
        xp: user.xp,
        leveledUp,
      } : undefined };
    }

    // Actualización normal
    const task = await prisma.task.update({
      where: { id },
      data,
    });

    return { task };
  }

  async deleteTask(id: string, userId: string) {
    // Verificar que la tarea existe y pertenece al usuario
    await this.getTaskById(id, userId);

    await prisma.task.delete({
      where: { id },
    });

    return { message: 'Task deleted successfully' };
  }

  async reorderTasks(userId: string, data: ReorderTasksInput) {
    // Verificar que todas las tareas pertenecen al usuario
    const tasks = await prisma.task.findMany({
      where: {
        id: { in: data.taskIds },
        userId,
      },
    });

    if (tasks.length !== data.taskIds.length) {
      throw new ApiError('Some tasks not found or do not belong to user', 404);
    }

    // Actualizar el orden de cada tarea
    const updates = data.taskIds.map((taskId, index) =>
      prisma.task.update({
        where: { id: taskId },
        data: { order: index },
      })
    );

    await Promise.all(updates);

    return { message: 'Tasks reordered successfully' };
  }

  private async grantTaskCompletionReward(userId: string) {
    const xpReward = GamificationUtil.calculateXPForTask();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const newXp = user.xp + xpReward;
    const newLevel = GamificationUtil.calculateLevel(newXp);

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });
  }

  private async updateDailyStatistics(
    userId: string,
    date: Date,
    updates: {
      addMinutes?: number;
      addSession?: boolean;
      addTask?: boolean;
      addXP?: number;
    }
  ) {
    const dateStr = date.toISOString().split('T')[0];

    await prisma.dailyStatistic.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(dateStr),
        },
      },
      create: {
        userId,
        date: new Date(dateStr),
        totalMinutes: updates.addMinutes || 0,
        sessionsCount: updates.addSession ? 1 : 0,
        tasksCompleted: updates.addTask ? 1 : 0,
        xpEarned: updates.addXP || 0,
      },
      update: {
        totalMinutes: { increment: updates.addMinutes || 0 },
        sessionsCount: { increment: updates.addSession ? 1 : 0 },
        tasksCompleted: { increment: updates.addTask ? 1 : 0 },
        xpEarned: { increment: updates.addXP || 0 },
      },
    });
  }
}

