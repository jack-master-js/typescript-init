"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protobufjs_1 = require("protobufjs");
var Protor = /** @class */ (function () {
    function Protor(path, packageName, messageName) {
        this.root = protobufjs_1.default.loadSync(path);
        this.packageName = packageName;
        this.msgType = this.root.lookupType("".concat(packageName, ".").concat(messageName));
    }
    Protor.prototype.encode = function (cmd, msg) {
        var _a;
        var data = (_a = {}, _a[cmd] = msg, _a);
        return this.msgType.encode(data).finish();
    };
    Protor.prototype.decode = function (buff) {
        try {
            var data = this.msgType.decode(buff);
            return {
                cmd: data.cmd,
                msg: data[data.cmd],
            };
        }
        catch (e) {
            return null;
        }
    };
    Protor.prototype.getEnum = function (enumName) {
        var enums = this.root.lookupEnum("".concat(this.packageName, ".").concat(enumName));
        var values = enums.values;
        var map = {};
        for (var k in values) {
            var index = values[k];
            map[k] = index;
            map[index] = k;
        }
        return map;
    };
    return Protor;
}());
exports.default = new Protor(__dirname + '../../../../public/chat.proto', 'chat', 'Body');
