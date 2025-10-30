import jwt, { Secret } from 'jsonwebtoken';
import env from '../config/env.js';
import { TokenPayload, Tokens } from '../types/index.js';

export class JWTUtil {
  static generateAccessToken(payload: TokenPayload): string {
    const secret: Secret = env.JWT_ACCESS_SECRET;
    return jwt.sign(payload, secret, {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    } as any);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    const secret: Secret = env.JWT_REFRESH_SECRET;
    return jwt.sign(payload, secret, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
    } as any);
  }

  static generateTokens(payload: TokenPayload): Tokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      const secret: Secret = env.JWT_ACCESS_SECRET;
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      const secret: Secret = env.JWT_REFRESH_SECRET;
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}

