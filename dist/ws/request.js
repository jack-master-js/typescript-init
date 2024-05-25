"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../common/utils/logger"));
exports.default = (client) => {
    client.on('ping', (msg) => {
        logger_1.default.info(msg);
        client.emit('pong', {
            clientTime: msg.clientTime,
            serverTime: Date.now(),
        });
    });
};
//# sourceMappingURL=request.js.map