import prisma from '../../config/database.js';
import { ApiError } from '../../middlewares/error.middleware.js';
import { UpdateProfileInput, UpdateSettingsInput } from './users.validation.js';

export class UsersService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
      },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Excluir password
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        avatar: data.avatar,
        dailyGoalMinutes: data.dailyGoalMinutes,
      },
      include: {
        settings: true,
      },
    });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async updateSettings(userId: string, data: UpdateSettingsInput) {
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Actualizar o crear settings
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    });

    return settings;
  }

  async deleteAccount(userId: string) {
    // Eliminar usuario (cascade eliminará todo lo relacionado)
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }
}

