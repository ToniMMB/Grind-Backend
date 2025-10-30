export declare class PasswordUtil {
    static hash(password: string): Promise<string>;
    static compare(password: string, hashedPassword: string): Promise<boolean>;
    static validate(password: string): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=password.util.d.ts.map