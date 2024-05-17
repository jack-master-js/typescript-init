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
}

export default new MainService();
