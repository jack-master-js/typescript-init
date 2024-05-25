"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
exports.default = (req, res, next) => {
    res.success = () => {
        res.send({
            success: true,
        });
        logger_1.default.info(`[http server] ${req.method} ${req.originalUrl} body: ${JSON.stringify(req.body)} success`);
    };
    res.data = (data, count = 0) => {
        res.send({
            success: true,
            data,
            count,
        });
        logger_1.default.info(`[http server]  ${req.method} ${req.originalUrl} body: ${JSON.stringify(req.body)} response: ${JSON.stringify(data)}`);
    };
    res.error = (error) => {
        const { message } = error;
        res.send({
            success: false,
            message,
        });
        logger_1.default.error(`[http server]  ${req.method} ${req.originalUrl} body: ${JSON.stringify(req.body)} error: ${message}`);
    };
    res.filePath = () => {
        let file = req.file;
        let files = req.files;
        if (file) {
            let fileName = req.file.filename;
            let filePath = `/uploads/${req.body.name}/${fileName}`;
            let data = {
                file: fileName,
                path: filePath,
            };
            logger_1.default.info(`[http server]  ${req.method} ${req.originalUrl} response: ${JSON.stringify(data)}`);
            return res.send({
                success: true,
                data: data,
            });
        }
        else if (files && files.length > 0) {
            let fileList = [];
            for (let file of files) {
                let fileName = file.filename;
                let filePath = `/uploads/${req.body.name}/${fileName}`;
                fileList.push({
                    file: fileName,
                    path: filePath,
                });
            }
            logger_1.default.info(`[http server]  ${req.method} ${req.originalUrl} response: ${JSON.stringify(fileList)}`);
            return res.send({
                success: true,
                data: fileList,
            });
        }
        else {
            throw Error('no file founded!');
        }
    };
    next();
};
//# sourceMappingURL=responser.js.map