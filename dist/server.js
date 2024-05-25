"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./common/utils/logger"));
const ws_1 = __importDefault(require("./ws"));
/**
 * Start Express server.
 */
const server = app_1.default.listen(app_1.default.get('port'), () => {
    logger_1.default.info('App is running at http://localhost:%d in %s mode', app_1.default.get('port'), app_1.default.get('env'));
});
/**
 * Start ws server.
 */
ws_1.default.start(server).then(() => {
    logger_1.default.info(`ws server is listening.`);
});
exports.default = server;
//# sourceMappingURL=server.js.map