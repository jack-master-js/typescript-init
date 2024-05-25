"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const compression_1 = __importDefault(require("compression"));
const response_time_1 = __importDefault(require("response-time"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./common/utils/logger"));
const responser_1 = __importDefault(require("./common/middleware/responser"));
const typeorm_1 = require("typeorm");
// routes
const main_router_1 = __importDefault(require("./main/main.router"));
const user_router_1 = __importDefault(require("./user/user.router"));
if (fs_1.default.existsSync('.env')) {
    logger_1.default.info('Using .env file to supply config environment variables');
    dotenv_1.default.config({ path: '.env' });
}
typeorm_1.createConnection()
    .then(() => {
    logger_1.default.info('数据库连接成功!');
})
    .catch((error) => logger_1.default.error(`数据库连接失败！ error: ${error.message}`));
const app = express_1.default();
app.set('port', process.env.PORT || 3000);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
app.use(cors_1.default({
    origin: process.env.WHITE_LIST.split(','),
    credentials: true,
}));
// performance
app.use(compression_1.default());
app.use(response_time_1.default());
app.use(connect_timeout_1.default('3s')); //req.timeout
// router
app.use(responser_1.default);
app.use('/api', main_router_1.default);
app.use('/api/user', user_router_1.default);
// 404
app.use((req, res, next) => {
    res.status = 404;
    next();
});
// error
app.use((err, req, res, next) => {
    res.error(err);
});
exports.default = app;
//# sourceMappingURL=app.js.map