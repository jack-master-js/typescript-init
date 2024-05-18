import { getManager } from 'typeorm';
import multer from '../common/utils/multer';

class MainService {
    /**
     * @api {POST} /api/upload 上传文件
     * @apiGroup Upload
     * @apiParam {String} name 值设置成 file
     */
    upload(req: any, res: any, next: any) {
        try {
            const upload = multer.single('file');
            upload(req, res, (err: any) => {
                if (err) {
                    res.error(err);
                } else {
                    res.filePath();
                }
            });
            res.success();
        } catch (error) {
            next(error);
        }
    }

    // 查询其他没有实体的表
    async query(req: any, res: any, next: any) {
        try {
            const books = await getManager().query('select * from book');
            const counts = await getManager().query(
                'select count(*) from book'
            );
            res.data(books, counts[0]['count(*)']);
        } catch (error) {
            next(error);
        }
    }
}

export default new MainService();
