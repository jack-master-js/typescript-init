import WebSocket from 'ws';
import logger from '../common/utils/logger';
import { getWsClientIp, getQueryStr } from '../common/utils';
import queryString from 'querystring';
import Client from './Client';
// import protor from '../common/utils/protor';

class WS {
    onlineClients: Map<any, any>;
    offlineClients: Map<any, any>;
    server: any;

    constructor() {
        this.onlineClients = new Map();
        this.offlineClients = new Map();
    }

    async start(server: any) {
        this.server = new WebSocket.Server({ server });
        this.server.on('connection', (socket: any, req: any) => {
            logger.info(`[ ws ] connection origin: ${req.headers.origin}`);
            logger.info(`[ ws ] connection url: ${req.url}`);

            socket.on('error', (e: any) => {
                logger.error(`[ ws ] ${socket.id} socket error: ${e.message}`);
            });

            // distribute the client from different path
            // if (req.url === '/login')
            this.handleConnection(socket, req);
        });
    }

    handleConnection(socket: any, req: any) {
        const ip = getWsClientIp(req);
        const queryStr = getQueryStr(req.url);
        const query = queryString.parse(queryStr);
        const { token } = query;

        //check client
        const clientID = this.checkClient(socket, token);

        try {
            if (!clientID) throw Error('invalid client');
            socket.id = clientID;

            let onlineClient = this.onlineClients.get(clientID);
            let offlineClient = this.offlineClients.get(clientID);
            let client = onlineClient || offlineClient;

            if (!client) {
                //new client
                client = this.newClient(socket);

                client.ip = ip;
                client.id = clientID;

                client.onNewConnection(socket);
            } else {
                //old client
                if (onlineClient) {
                    throw Error('you already login somewhere else!!!');
                    // this.kickOut(
                    //     onlineClient.socket,
                    //     'you login somewhere else.'
                    // )
                    // client.onKickOut(socket)
                }

                if (offlineClient) {
                    this.offlineClients.delete(clientID);
                }

                client.onReConnection(socket);
            }

            //用户上线
            client.online(socket, async () => {
                this.onlineClients.set(clientID, client);

                this.socketMsg(socket, 'loginRes', {
                    clientInfo: client.info,
                });
            });

            //用户下线
            client.onOffline(socket, async () => {
                this.onlineClients.delete(clientID);
                this.offlineClients.set(clientID, client);
            });
        } catch (e) {
            this.kickOut(socket, e.message);
        }
    }

    checkClient(socket: any, token: any) {
        if (!token) this.kickOut(socket, 'need token');
        // todo: find user in db, return a user id
        return token;
    }

    newClient(socket: any) {
        // todo: check the user info in db
        return new Client(socket, { name: 'test user' });
    }

    //当前建立连接的用户
    socketMsg(socket: any, cmd: any, msg: any) {
        socket.send(JSON.stringify({ cmd, msg }));
        // socket.send(protor.encode(cmd, msg));
    }

    //所有用户
    broadcast(cmd: any, msg: any) {
        this.onlineClients.forEach((client) => {
            client.emit(cmd, msg);
        });
    }

    checkOnline(clientID: any) {
        return this.onlineClients.get(clientID);
    }

    kickOut(socket: any, message: any) {
        if (socket) {
            this.socketMsg(socket, 'systemNotice', { message });
            socket.close();
        }
    }

    kickOutAll(msg: any) {
        this.onlineClients.forEach((client) => {
            this.kickOut(client.socket, msg);
        });
    }

    async close() {
        logger.error(`[ ws ] wsServer is closed.`);
    }
}

export default new WS();
