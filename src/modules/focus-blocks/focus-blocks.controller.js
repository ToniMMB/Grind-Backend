"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusBlocksController = void 0;
const focus_blocks_service_js_1 = require("./focus-blocks.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class FocusBlocksController {
    constructor() {
        this.getFocusBlocks = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const query = req.query;
                const focusBlocks = await this.focusBlocksService.getFocusBlocks(req.user.id, query);
                response_util_js_1.ResponseUtil.success(res, { focusBlocks });
            }
            catch (error) {
                next(error);
            }
        };
        this.getFocusBlockById = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const focusBlock = await this.focusBlocksService.getFocusBlockById(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, { focusBlock });
            }
            catch (error) {
                next(error);
            }
        };
        this.createFocusBlock = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                console.log('📥 Datos recibidos en el backend:', req.body);
                const data = req.body;
                const focusBlock = await this.focusBlocksService.createFocusBlock(req.user.id, data);
                console.log('✅ Bloque creado en BD:', focusBlock);
                response_util_js_1.ResponseUtil.created(res, { focusBlock }, 'Focus block created successfully');
            }
            catch (error) {
                console.error('❌ Error en createFocusBlock:', error);
                next(error);
            }
        };
        this.updateFocusBlock = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const data = req.body;
                const focusBlock = await this.focusBlocksService.updateFocusBlock(id, req.user.id, data);
                response_util_js_1.ResponseUtil.success(res, { focusBlock }, 'Focus block updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteFocusBlock = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const result = await this.focusBlocksService.deleteFocusBlock(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.focusBlocksService = new focus_blocks_service_js_1.FocusBlocksService();
    }
}
exports.FocusBlocksController = FocusBlocksController;
//# sourceMappingURL=focus-blocks.controller.js.map