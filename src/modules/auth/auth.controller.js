"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("./auth.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class AuthController {
    constructor() {
        this.register = async (req, res, next) => {
            try {
                const data = req.body;
                const result = await this.authService.register(data);
                response_util_js_1.ResponseUtil.created(res, result, 'User registered successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const data = req.body;
                const result = await this.authService.login(data);
                response_util_js_1.ResponseUtil.success(res, result, 'Login successful');
            }
            catch (error) {
                next(error);
            }
        };
        this.refresh = async (req, res, next) => {
            try {
                const { refreshToken } = req.body;
                const result = await this.authService.refreshToken(refreshToken);
                response_util_js_1.ResponseUtil.success(res, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.logout = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const result = await this.authService.logout(req.user.id);
                response_util_js_1.ResponseUtil.success(res, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.authService = new auth_service_js_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map