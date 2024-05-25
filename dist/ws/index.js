"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const logger_1 = __importDefault(require("../common/utils/logger"));
const utils_1 = require("../common/utils");
const querystring_1 = __importDefault(require("querystring"));
const Client_1 = __importDefault(require("./Client"));
const protor_1 = __importDefault(require("../common/utils/protor"));
class WS {
    constructor() {
        this.onlineClients = new Map();
        this.offlineClients = new Map();
    }
    start(server) {
        return __awaiter(this, void 0, void 0, function* () {
            this.server = new ws_1.default.Server({ server });
            this.server.on('connection', (socket, req) => {
                logger_1.default.info(`[ ws ] connection origin: ${req.headers.origin}`);
                logger_1.default.info(`[ ws ] connection url: ${req.url}`);
                socket.on('error', (e) => {
                    logger_1.default.error(`[ ws ] ${socket.id} socket error: ${e.message}`);
                });
                // distribute the client from different path
                // if (req.url === '/login')
                this.handleConnection(socket, req);
            });
        });
    }
    handleConnection(socket, req) {
        const ip = utils_1.getWsClientIp(req);
        const queryStr = utils_1.getQueryStr(req.url);
        const query = querystring_1.default.parse(queryStr);
        const { token } = query;
        //check client
        const clientID = this.checkClient(socket, token);
        try {
            if (!clientID)
                throw Error('invalid client');
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
            }
            else {
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
            client.online(socket, () => __awaiter(this, void 0, void 0, function* () {
                this.onlineClients.set(clientID, client);
                this.socketMsg(socket, 'loginRes', {
                    clientInfo: client.info,
                });
            }));
            //用户下线
            client.onOffline(socket, () => __awaiter(this, void 0, void 0, function* () {
                this.onlineClients.delete(clientID);
                this.offlineClients.set(clientID, client);
            }));
        }
        catch (e) {
            this.kickOut(socket, e.message);
        }
    }
    checkClient(socket, token) {
        if (!token)
            this.kickOut(socket, 'need token');
        // todo: find user in db, return a user id
        return token;
    }
    newClient(socket) {
        // todo: check the user info in db
        return new Client_1.default(socket, { name: 'test user' });
    }
    //当前建立连接的用户
    socketMsg(socket, cmd, msg) {
        if (process.env.PROTO === 'yes') {
            socket.send(protor_1.default.encode(cmd, msg));
        }
        else {
            socket.send(JSON.stringify({ cmd, msg }));
        }
    }
    //所有用户
    broadcast(cmd, msg) {
        this.onlineClients.forEach((client) => {
            client.emit(cmd, msg);
        });
    }
    checkOnline(clientID) {
        return this.onlineClients.get(clientID);
    }
    kickOut(socket, message) {
        if (socket) {
            this.socketMsg(socket, 'systemNotice', { message });
            socket.close();
        }
    }
    kickOutAll(msg) {
        this.onlineClients.forEach((client) => {
            this.kickOut(client.socket, msg);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.error(`[ ws ] wsServer is closed.`);
        });
    }
}
exports.default = new WS();
//# sourceMappingURL=index.js.map