import logger from '../common/utils/logger';

export default (player: any) => {
    player.on('ping', (msg: any) => {
        logger.info(msg);
        player.emit('pong', {
            clientTime: msg.clientTime,
            serverTime: Date.now(),
        });
    });
};
