"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protobufjs_1 = __importDefault(require("protobufjs"));
class Protor {
    constructor(path, packageName, messageName) {
        this.root = protobufjs_1.default.loadSync(path);
        this.packageName = packageName;
        this.msgType = this.root.lookupType(`${packageName}.${messageName}`);
    }
    encode(cmd, msg) {
        let data = { [cmd]: msg };
        return this.msgType.encode(data).finish();
    }
    decode(buff) {
        try {
            let data = this.msgType.decode(buff);
            return {
                cmd: data.cmd,
                msg: data[data.cmd],
            };
        }
        catch (e) {
            return null;
        }
    }
    getEnum(enumName) {
        let enums = this.root.lookupEnum(`${this.packageName}.${enumName}`);
        let values = enums.values;
        let map = {};
        for (const k in values) {
            let index = values[k];
            map[k] = index;
            map[index] = k;
        }
        return map;
    }
}
exports.default = new Protor(__dirname + '../../../../public/chat.proto', 'chat', 'Body');
//# sourceMappingURL=protor.js.map