import fetch from 'node-fetch';
import queryString from 'querystring';
import logger from './logger';

export default (url: string, data: any, method = 'GET', headers = {}) => {
    let options: any = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (data) {
        if (options.method === 'GET') {
            url = `${url}?${queryString.stringify(data)}`;
        } else {
            options.body = JSON.stringify(data);
        }
    }

    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(async (res: any) => {
                const ret = await res.json();
                resolve(ret);
                logger.info(
                    `[ Request ] ${method} ${url} body: ${JSON.stringify(
                        data
                    )} receive: ${JSON.stringify(ret)}`
                );
            })
            .catch((e: any) => {
                reject(e.message);
                logger.error(
                    `[ Request ] ${method} ${url} body: ${JSON.stringify(
                        data
                    )} error: ${e.message}`
                );
            });
    });
};
