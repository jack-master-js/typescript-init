import app from './app';
import logger from './common/utils/logger';
import ws from './ws';

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
    logger.info(
        'App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
    );
});

/**
 * Start ws server.
 */
ws.start(server).then(() => {
    logger.info(`ws server is listening.`);
});

export default server;
