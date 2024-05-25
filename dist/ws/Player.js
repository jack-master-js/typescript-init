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
const logger_1 = __importDefault(require("../common/utils/logger"));
const request_1 = __importDefault(require("./request"));
class Player {
    constructor(socket, info) {
        this.socket = socket;
        this.info = info;
        this.handlers = new Map();
        this.handler();
        request_1.default(this);
    }
    on(cmd, callback) {
        this.handlers.set(cmd, callback);
    }
    emit(cmd, msg) {
        this.socket.send(JSON.stringify({ cmd, msg }));
    }
    handler() {
        this.socket.on('message', (data) => {
            const { cmd, msg } = JSON.parse(data);
            if (cmd)
                this.trigger(cmd, msg, false);
        });
    }
    trigger(cmd, msg, fromSystem = true) {
        let handle = this.handlers.get(cmd);
        if (handle) {
            msg = msg || {};
            msg.fromSystem = fromSystem;
            handle(msg);
        }
    }
    onNewConnection(socket) {
        logger_1.default.info(`[ Player ] ${socket.id} new connected!`);
    }
    onReConnection(socket) {
        logger_1.default.info(`[ Player ] ${socket.id} reconnected!`);
        this.socket = socket;
        this.handler();
    }
    onKickOut(socket) {
        logger_1.default.info(`[ Player ] ${socket.id} was kick out!`);
    }
    online(socket, playerOnline) {
        return __awaiter(this, void 0, void 0, function* () {
            yield playerOnline();
            logger_1.default.info(`[ Player ] ${socket.id} is online!`);
            this.joinRoom();
        });
    }
    onOffline(socket, playerOffline) {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.on('close', () => __awaiter(this, void 0, void 0, function* () {
                if (socket === this.socket) {
                    yield playerOffline();
                    logger_1.default.info(`[ Player ] ${socket.id} is offline!`);
                }
            }));
        });
    }
    joinRoom() { }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map