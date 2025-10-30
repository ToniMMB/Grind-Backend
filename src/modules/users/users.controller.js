"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_service_js_1 = require("./users.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class UsersController {
    constructor() {
        this.getProfile = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const user = await this.usersService.getProfile(req.user.id);
                response_util_js_1.ResponseUtil.success(res, user);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const data = req.body;
                const user = await this.usersService.updateProfile(req.user.id, data);
                response_util_js_1.ResponseUtil.success(res, user, 'Profile updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSettings = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const data = req.body;
                const settings = await this.usersService.updateSettings(req.user.id, data);
                response_util_js_1.ResponseUtil.success(res, { settings }, 'Settings updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteAccount = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const result = await this.usersService.deleteAccount(req.user.id);
                response_util_js_1.ResponseUtil.success(res, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.usersService = new users_service_js_1.UsersService();
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map