import logger from '../common/utils/logger';

export default (client: any) => {
    client.on('ping', (msg: any) => {
        logger.info(msg);
        client.emit('pong', {
            clientTime: msg.clientTime,
            serverTime: Date.now(),
        });
    });
};
