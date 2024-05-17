import logger from '../utils/logger';

export default (req: any, res: any, next: any) => {
    res.success = () => {
        res.send({
            success: true,
        });
        logger.info(
            `[http server] ${req.method} ${
                req.originalUrl
            } body: ${JSON.stringify(req.body)} success`
        );
    };

    res.data = (data: any, count = 0) => {
        res.send({
            success: true,
            data,
            count,
        });

        logger.info(
            `[http server]  ${req.method} ${
                req.originalUrl
            } body: ${JSON.stringify(req.body)} response: ${JSON.stringify(
                data
            )}`
        );
    };

    res.error = (error: any) => {
        const { message } = error;
        res.send({
            success: false,
            message,
        });

        logger.error(
            `[http server]  ${req.method} ${
                req.originalUrl
            } body: ${JSON.stringify(req.body)} error: ${message}`
        );
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

            logger.info(
                `[http server]  ${req.method} ${
                    req.originalUrl
                } response: ${JSON.stringify(data)}`
            );
            return res.send({
                success: true,
                data: data,
            });
        } else if (files && files.length > 0) {
            let fileList = [];
            for (let file of files) {
                let fileName = file.filename;
                let filePath = `/uploads/${req.body.name}/${fileName}`;

                fileList.push({
                    file: fileName,
                    path: filePath,
                });
            }

            logger.info(
                `[http server]  ${req.method} ${
                    req.originalUrl
                } response: ${JSON.stringify(fileList)}`
            );
            return res.send({
                success: true,
                data: fileList,
            });
        } else {
            throw Error('no file founded!');
        }
    };

    next();
};
