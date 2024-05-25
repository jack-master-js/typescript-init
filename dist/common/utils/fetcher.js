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
const node_fetch_1 = __importDefault(require("node-fetch"));
const querystring_1 = __importDefault(require("querystring"));
const logger_1 = __importDefault(require("./logger"));
exports.default = (url, data, method = 'GET', headers = {}) => {
    let options = {
        method: method.toUpperCase(),
        headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
    };
    if (data) {
        if (options.method === 'GET') {
            url = `${url}?${querystring_1.default.stringify(data)}`;
        }
        else {
            options.body = JSON.stringify(data);
        }
    }
    return new Promise((resolve, reject) => {
        node_fetch_1.default(url, options)
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            const ret = yield res.json();
            resolve(ret);
            logger_1.default.info(`[ Request ] ${method} ${url} body: ${JSON.stringify(data)} receive: ${JSON.stringify(ret)}`);
        }))
            .catch((e) => {
            reject(e.message);
            logger_1.default.error(`[ Request ] ${method} ${url} body: ${JSON.stringify(data)} error: ${e.message}`);
        });
    });
};
//# sourceMappingURL=fetcher.js.map