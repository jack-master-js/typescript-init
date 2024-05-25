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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../common/entity/User");
const utils_1 = require("../common/utils");
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const enum_1 = require("../common/lib/enum");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    /**
     * @api {POST} /api/user/create 新增用户
     * @apiGroup User
     * @apiUse UserEntity
     */
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                if (!user.email || !user.password)
                    throw Error(enum_1.ERROR_MSG.LACK_PARAMS);
                user.password = yield bcrypt_1.default.hash(user.password, 10);
                yield User_1.User.save(req.body);
                res.success();
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {POST} /api/user/update 更新用户
     * @apiGroup User
     * @apiBody {String} id 用户ID
     * @apiUse UserEntity
     */
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, email, password } = req.body;
                if (!id)
                    throw Error(enum_1.ERROR_MSG.LACK_PARAMS);
                yield User_1.User.update(req.body.id, req.body);
                res.success();
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {POST} /api/user/find 查询用户
     * @apiGroup User
     * @apiBody {Number} pageIndex 分页序号
     * @apiBody {Number} pageSize 分页数量
     */
    find(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { pageIndex, pageSize } = _a, where = __rest(_a, ["pageIndex", "pageSize"]);
                const query = utils_1.page(pageIndex, pageSize, where);
                let [users, count] = yield User_1.User.findAndCount(query);
                res.data(users, count);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {POST} /api/user/get 获取用户详情
     * @apiGroup User
     * @apiBody {String} id 用户ID
     */
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield User_1.User.findOne(req.body.id);
                res.data(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {POST} /api/user/del 删除用户
     * @apiGroup User
     * @apiBody {String} id 用户ID
     */
    del(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield User_1.User.delete(req.body.id);
                res.success();
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {POST} /api/user/export 导出用户列表
     * @apiGroup User
     * @apiDescription 此接口需用浏览器打开实现下载
     */
    export(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = [
                    [1, 2, 3],
                    [true, false, null, 'sheetjs'],
                    ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
                    ['baz', null, 'qux'],
                ];
                let buffer = node_xlsx_1.default.build([{ name: 'mySheetName', data: data }]);
                res.attachment('mySheetName.xlsx');
                res.send(buffer);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {POST} /api/user/login 登录
     * @apiGroup User
     *
     * @apiBody {String} email 账号
     * @apiBody {String} password 密码
     * @apiSuccess {String} token 令牌
     */
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield User_1.User.findOne({ email });
                if (!user)
                    throw Error(enum_1.ERROR_MSG.NO_RECORD);
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
                if (isMatch) {
                    const token = jsonwebtoken_1.default.sign({ email }, process.env.TOKEN_SECRET, {
                        expiresIn: '24h',
                    });
                    res.data({ token });
                }
                else {
                    throw Error(enum_1.ERROR_MSG.NOT_MATCH);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map