"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryStr = exports.getWsClientIp = exports.cloneDeep = exports.randomMap = exports.shuffle = exports.random = exports.sleep = exports.page = void 0;
function page(pageIndex, pageSize, where) {
    return {
        skip: pageIndex - 1,
        take: pageSize,
        where,
    };
}
exports.page = page;
function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
exports.sleep = sleep;
function random(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}
exports.random = random;
function shuffle(arr) {
    let _arr = arr.slice();
    for (let i = 0; i < _arr.length; i++) {
        let temp = _arr[i];
        let j = this.random(0, i);
        _arr[i] = _arr[j];
        _arr[j] = temp;
    }
    return _arr;
}
exports.shuffle = shuffle;
function randomMap(start, end, arr) {
    let _start = arr.length + start;
    let map = {};
    for (let i = _start; i < end; i++) {
        map[i] = i;
    }
    let index = end - 1;
    while (index >= start) {
        let num = this.random(start, index);
        let temp = map[num];
        map[num] = map[index];
        map[index] = temp;
        index--;
    }
    return map;
}
exports.randomMap = randomMap;
function cloneDeep(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.cloneDeep = cloneDeep;
function getWsClientIp(request) {
    let ip = '';
    if (request.headers['x-forwarded-for']) {
        ip = request.headers['x-forwarded-for'].split(/\s*, \s*/)[0];
    }
    else if (request.connection.remoteAddress) {
        ip = request.connection.remoteAddress.split(':').pop();
    }
    return ip;
}
exports.getWsClientIp = getWsClientIp;
function getQueryStr(url) {
    let index = url.indexOf('?');
    if (index >= 0)
        return url.slice(index + 1);
    return '';
}
exports.getQueryStr = getQueryStr;
//# sourceMappingURL=index.js.map