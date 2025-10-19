import prisma from '../../config/database.js';
import { PasswordUtil } from '../../utils/password.util.js';
import { JWTUtil } from '../../utils/jwt.util.js';
import { ApiError } from '../../middlewares/error.middleware.js';
import { RegisterInput, LoginInput } from './auth.validation.js';
import { PREDEFINED_BLOCKS } from '../../../prisma/seed.js';

export class AuthService {
  async register(data: RegisterInput) {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ApiError('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(data.password);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });

    // Crear settings por defecto
    await prisma.userSettings.create({
      data: {
        userId: user.id,
      },
    });

    // Crear bloques predefinidos
    for (const block of PREDEFINED_BLOCKS) {
      await prisma.focusBlock.create({
        data: {
          userId: user.id,
          name: block.name,
          description: block.description,
          type: block.type,
          icon: block.icon,
          startTime: block.startTime,
          endTime: block.endTime,
          daysOfWeek: block.daysOfWeek,
        },
      });
    }

    // Generar tokens
    const tokens = JWTUtil.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        xp: user.xp,
      },
      ...tokens,
    };
  }

  async login(data: LoginInput) {
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Verificar password
    const isPasswordValid = await PasswordUtil.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Generar tokens
    const tokens = JWTUtil.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        xp: user.xp,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = JWTUtil.verifyRefreshToken(refreshToken);

      // Verificar que el usuario existe
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new ApiError('User not found', 404);
      }

      // Generar nuevo access token
      const accessToken = JWTUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      return { accessToken };
    } catch (error) {
      throw new ApiError('Invalid refresh token', 401);
    }
  }

  async logout(userId: string) {
    // En una implementación más avanzada, podrías invalidar el refresh token
    // guardándolo en una blacklist en Redis
    return { message: 'Logged out successfully' };
  }
}

