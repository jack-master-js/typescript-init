"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const md5_1 = __importDefault(require("md5"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        try {
            // if (!req.body.name) throw Error("need name field.");
            cb(null, `public/uploads/`);
        }
        catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const original = file.originalname.split('.');
        cb(null, `${original[0]}-${md5_1.default(file.stream)}.${original[1]}`);
    },
});
exports.default = multer_1.default({ storage: storage });
//# sourceMappingURL=multer.js.map