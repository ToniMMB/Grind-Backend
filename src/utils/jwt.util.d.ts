import { TokenPayload, Tokens } from '../types/index.js';
export declare class JWTUtil {
    static generateAccessToken(payload: TokenPayload): string;
    static generateRefreshToken(payload: TokenPayload): string;
    static generateTokens(payload: TokenPayload): Tokens;
    static verifyAccessToken(token: string): TokenPayload;
    static verifyRefreshToken(token: string): TokenPayload;
}
//# sourceMappingURL=jwt.util.d.ts.map