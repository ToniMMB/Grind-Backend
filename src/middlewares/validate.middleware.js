"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const zod_1 = require("zod");
const response_util_js_1 = require("../utils/response.util.js");
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                console.error('❌ Errores de validación:', error.errors);
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                response_util_js_1.ResponseUtil.error(res, 'Validation failed', 400);
            }
            else {
                response_util_js_1.ResponseUtil.serverError(res);
            }
        }
    };
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                response_util_js_1.ResponseUtil.error(res, 'Query validation failed', 400);
            }
            else {
                response_util_js_1.ResponseUtil.serverError(res);
            }
        }
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                response_util_js_1.ResponseUtil.error(res, 'Params validation failed', 400);
            }
            else {
                response_util_js_1.ResponseUtil.serverError(res);
            }
        }
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validate.middleware.js.map