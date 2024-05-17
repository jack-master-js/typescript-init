import protobuf from 'protobufjs';

class Protor {
    root: any;
    packageName: any;
    msgType: any;
    constructor(path: any, packageName: any, messageName: any) {
        this.root = protobuf.loadSync(path);
        this.packageName = packageName;
        this.msgType = this.root.lookupType(`${packageName}.${messageName}`);
    }

    encode(cmd: any, msg: any) {
        let data = { [cmd]: msg };
        return this.msgType.encode(data).finish();
    }

    decode(buff: any) {
        try {
            let data = this.msgType.decode(buff);
            return {
                cmd: data.cmd,
                msg: data[data.cmd],
            };
        } catch (e) {
            return null;
        }
    }

    getEnum(enumName: any) {
        let enums = this.root.lookupEnum(`${this.packageName}.${enumName}`);
        let values = enums.values;
        let map: any = {};
        for (const k in values) {
            let index = values[k];
            map[k] = index;
            map[index] = k;
        }
        return map;
    }
}

export default new Protor(
    __dirname + '../../../../public/chat.proto',
    'chat',
    'Body'
);
