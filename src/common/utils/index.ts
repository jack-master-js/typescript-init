export function page(pageIndex: number, pageSize: number, where: any) {
    return {
        skip: pageIndex - 1,
        take: pageSize,
        where,
    };
}

export function mapToObj(map: any) {
    return Array.from(map).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
}

export function sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function random(min: number, max: number) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

export function shuffle(arr: any) {
    let _arr = arr.slice();
    for (let i = 0; i < _arr.length; i++) {
        let temp = _arr[i];
        let j = this.random(0, i);
        _arr[i] = _arr[j];
        _arr[j] = temp;
    }
    return _arr;
}

export function randomMap(start: any, end: any, arr: any) {
    let _start = arr.length + start;
    let map: any = {};
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

export function cloneDeep(data: any) {
    return JSON.parse(JSON.stringify(data));
}

export function getWsClientIp(request: any) {
    let ip = '';
    if (request.headers['x-forwarded-for']) {
        ip = request.headers['x-forwarded-for'].split(/\s*, \s*/)[0];
    } else if (request.connection.remoteAddress) {
        ip = request.connection.remoteAddress.split(':').pop();
    }
    return ip;
}

export function getQueryStr(url: string) {
    let index = url.indexOf('?');
    if (index >= 0) return url.slice(index + 1);
    return '';
}
