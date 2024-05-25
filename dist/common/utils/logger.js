"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
log4js_1.default.configure({
    appenders: {
        console: { type: 'console' },
        file: {
            type: 'file',
            filename: 'logs/server',
            pattern: 'yyyy.MM.dd',
            alwaysIncludePattern: true,
        },
    },
    categories: {
        default: { appenders: ['console', 'file'], level: 'trace' },
        prod: { appenders: ['console', 'file'], level: 'warn' },
    },
});
let logger;
if (process.env.NODE_ENV === 'production') {
    logger = log4js_1.default.getLogger('prod');
}
else {
    logger = log4js_1.default.getLogger();
}
exports.default = logger;
//# sourceMappingURL=logger.js.map