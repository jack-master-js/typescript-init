"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = __importDefault(require("./user.service"));
const auth_1 = __importDefault(require("../common/middleware/auth"));
const router = express_1.default.Router();
/* /api/user */
router.post('/create', user_service_1.default.create);
router.post('/update', user_service_1.default.update);
router.post('/find', user_service_1.default.find);
router.post('/get', user_service_1.default.get);
router.post('/del', auth_1.default, user_service_1.default.del);
router.post('/export', auth_1.default, user_service_1.default.export);
router.post('/login', user_service_1.default.login);
exports.default = router;
//# sourceMappingURL=user.router.js.map