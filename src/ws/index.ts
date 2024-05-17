import WebSocket from 'ws';
import logger from '../common/utils/logger';
import { getWsClientIp, getQueryStr } from '../common/utils';
import queryString from 'querystring';
import User from './User';
import protor from '../common/utils/protor';

class WS {
    onlineUsers: Map<any, any>;
    offlineUsers: Map<any, any>;
    server: any;

    constructor() {
        this.onlineUsers = new Map();
        this.offlineUsers = new Map();
    }

    async start(server: any) {
        this.server = new WebSocket.Server({ server });
        this.server.on('connection', (socket: any, req: any) => {
            logger.info(`[ ws ] connection origin: ${req.headers.origin}`);
            logger.info(`[ ws ] connection url: ${req.url}`);

            socket.on('error', (e: any) => {
                logger.error(`[ ws ] ${socket.id} socket error: ${e.message}`);
            });

            // distribute the user from different path
            // if (req.url === '/login')
            this.handleConnection(socket, req);
        });
    }

    handleConnection(socket: any, req: any) {
        const ip = getWsClientIp(req);
        const queryStr = getQueryStr(req.url);
        const query = queryString.parse(queryStr);
        const { token } = query;

        //check user
        const userID = this.checkUser(socket, token);

        try {
            if (!userID) throw Error('invalid user');
            socket.id = userID;

            let onlineUser = this.onlineUsers.get(userID);
            let offlineUser = this.offlineUsers.get(userID);
            let user = onlineUser || offlineUser;

            if (!user) {
                //new user
                user = this.newUser(socket);

                user.ip = ip;
                user.id = userID;

                user.onNewConnection(socket);
            } else {
                //old user
                if (onlineUser) {
                    throw Error('you already login somewhere else.');
                    // this.kickOut(
                    //     onlineUser.socket,
                    //     'you login somewhere else.'
                    // )
                    // user.onKickOut(socket)
                }

                if (offlineUser) {
                    this.offlineUsers.delete(userID);
                }

                user.onReConnection(socket);
            }

            //用户上线
            user.online(socket, async () => {
                this.onlineUsers.set(userID, user);

                this.socketMsg(socket, 'loginRes', {
                    userInfo: user.info,
                });
            });

            //用户下线
            user.onOffline(socket, async () => {
                this.onlineUsers.delete(userID);
                this.offlineUsers.set(userID, user);
            });
        } catch (e) {
            this.kickOut(socket, e.message);
        }
    }

    checkUser(socket: any, token: any) {
        if (!token) this.kickOut(socket, 'need token');
        // todo: find user in db, return a user id
        return '1';
    }

    newUser(socket: any) {
        return new User(socket, { name: 'test user' });
    }

    //当前建立连接的用户
    socketMsg(socket: any, cmd: any, msg: any) {
        socket.send(JSON.stringify({ cmd, msg }));
        // socket.send(protor.encode(cmd, msg));
    }

    //所有用户
    broadcast(cmd: any, msg: any) {
        this.onlineUsers.forEach((user) => {
            user.emit(cmd, msg);
        });
    }

    checkOnline(userID: any) {
        return this.onlineUsers.get(userID);
    }

    kickOut(socket: any, message: any) {
        if (socket) {
            this.socketMsg(socket, 'systemNotice', { message });
            socket.close();
        }
    }

    kickOutAll(msg: any) {
        this.onlineUsers.forEach((user) => {
            this.kickOut(user.socket, msg);
        });
    }

    async close() {
        logger.error(`[ ws ] wsServer is closed.`);
    }
}

export default new WS();
