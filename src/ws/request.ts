import logger from '../common/utils/logger';

export default (user: any) => {
    user.on('ping', (msg: any) => {
        logger.info(msg);
        user.emit('pong', {
            clientTime: msg.clientTime,
            serverTime: Date.now(),
        });
    });
};
