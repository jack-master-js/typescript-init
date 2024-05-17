import logger from '../common/utils/logger';
import request from './request';

class Player {
    socket: any;
    info: any;
    handlers: Map<any, any>;
    constructor(socket: any, info: any) {
        this.socket = socket;
        this.info = info;

        this.handlers = new Map();
        this.handler();
        request(this);
    }

    on(cmd: any, callback: any) {
        this.handlers.set(cmd, callback);
    }

    emit(cmd: any, msg: any) {
        this.socket.send(JSON.stringify({ cmd, msg }));
    }

    handler() {
        this.socket.on('message', (data: any) => {
            const { cmd, msg } = JSON.parse(data);
            if (cmd) this.trigger(cmd, msg, false);
        });
    }

    trigger(cmd: any, msg: any, fromSystem = true) {
        let handle = this.handlers.get(cmd);
        if (handle) {
            msg = msg || {};
            msg.fromSystem = fromSystem;
            handle(msg);
        }
    }

    onNewConnection(socket: any) {
        logger.info(`[ Player ] ${socket.id} new connected!`);
    }

    onReConnection(socket: any) {
        logger.info(`[ Player ] ${socket.id} reconnected!`);
        this.socket = socket;
        this.handler();
    }

    onKickOut(socket: any) {
        logger.info(`[ Player ] ${socket.id} was kick out!`);
    }

    async online(socket: any, playerOnline: any) {
        await playerOnline();
        logger.info(`[ Player ] ${socket.id} is online!`);

        this.joinRoom();
    }

    async onOffline(socket: any, playerOffline: any) {
        this.socket.on('close', async () => {
            if (socket === this.socket) {
                await playerOffline();
                logger.info(`[ Player ] ${socket.id} is offline!`);
            }
        });
    }

    joinRoom() {}
}

export default Player;
