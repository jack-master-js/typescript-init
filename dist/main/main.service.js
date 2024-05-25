"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const multer_1 = __importDefault(require("../common/utils/multer"));
class MainService {
    /**
     * @api {POST} /api/upload 上传文件
     * @apiGroup Upload
     * @apiParam {String} name 值设置成 file
     */
    upload(req, res, next) {
        try {
            const upload = multer_1.default.single('file');
            upload(req, res, (err) => {
                if (err) {
                    res.error(err);
                }
                else {
                    res.filePath();
                }
            });
            res.success();
        }
        catch (error) {
            next(error);
        }
    }
    // 查询其他没有实体的表
    query(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const books = yield typeorm_1.getManager().query('select * from book');
                const counts = yield typeorm_1.getManager().query('select count(*) from book');
                res.data(books, counts[0]['count(*)']);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new MainService();
//# sourceMappingURL=main.service.js.map