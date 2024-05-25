"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const main_service_1 = __importDefault(require("./main.service"));
const router = express_1.default.Router();
/* /api */
router.post('/upload', main_service_1.default.upload);
router.post('/query', main_service_1.default.query);
exports.default = router;
//# sourceMappingURL=main.router.js.map