import { User } from '../common/entity/User';
import { page } from '../common/utils';
import xlsx from 'node-xlsx';
import bcrypt from 'bcrypt';
import { ERROR_MSG } from '../common/lib/enum';
import jwt from 'jsonwebtoken';

class UserService {
    /**
     * @api {POST} /api/user/create 新增用户
     * @apiGroup User
     * @apiUse UserEntity
     */
    async create(req: any, res: any, next: any) {
        try {
            const user = req.body;
            if (!user.email || !user.password)
                throw Error(ERROR_MSG.LACK_PARAMS);
            user.password = await bcrypt.hash(user.password, 10);
            await User.save(req.body);
            res.success();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/update 更新用户
     * @apiGroup User
     * @apiBody {String} id 用户ID
     * @apiUse UserEntity
     */
    async update(req: any, res: any, next: any) {
        try {
            const { id, email, password } = req.body;
            if (!id) throw Error(ERROR_MSG.LACK_PARAMS);
            await User.update(req.body.id, req.body);
            res.success();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/find 查询用户
     * @apiGroup User
     * @apiQuery {Number} pageIndex 分页序号
     * @apiQuery {Number} pageSize 分页数量
     */
    async find(req: any, res: any, next: any) {
        try {
            const { pageIndex, pageSize, ...where } = req.body;
            const query = page(pageIndex, pageSize, where);
            let [users, count] = await User.findAndCount(query);
            res.data(users, count);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/get 获取用户详情
     * @apiGroup User
     * @apiQuery {String} id 用户ID
     */
    async get(req: any, res: any, next: any) {
        try {
            let user = await User.findOne(req.body.id);
            res.data(user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/del 删除用户
     * @apiGroup User
     * @apiBody {String} id 用户ID
     */
    async del(req: any, res: any, next: any) {
        try {
            await User.delete(req.body.id);
            res.success();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/export 导出用户列表
     * @apiGroup User
     * @apiDescription 此接口需用浏览器打开实现下载
     */
    async export(req: any, res: any, next: any) {
        try {
            const data = [
                [1, 2, 3],
                [true, false, null, 'sheetjs'],
                ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
                ['baz', null, 'qux'],
            ];
            let buffer = xlsx.build([{ name: 'mySheetName', data: data }]);
            res.attachment('mySheetName.xlsx');
            res.send(buffer);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/login 登录
     * @apiGroup User
     *
     * @apiParam {String} email 账号
     * @apiParam {String} password 密码
     * @apiSuccess {String} token 令牌
     */
    async login(req: any, res: any, next: any) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) throw Error(ERROR_MSG.NO_RECORD);
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {
                    expiresIn: '24h',
                });
                res.data({ token });
            } else {
                throw Error(ERROR_MSG.NOT_MATCH);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new UserService();
