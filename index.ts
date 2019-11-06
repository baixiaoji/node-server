///<reference path="node_modules/@types/mime/index.d.ts"/>
import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as fs from "fs";
import * as p from 'path';
import * as url from "url";
import * as mime from 'mime';

const server = http.createServer();
const publicPath = p.resolve(__dirname, './public');
const cacheTime = 3600 * 24 * 30;
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const { method, url:path } = request;
    const {pathname} = url.parse(path);
    if (method !== 'GET') {
        response.statusCode = 405;
        response.end('服务器繁忙');
        return;
    }
    let fileName = pathname.slice(1);
    if (fileName === '') {
        fileName = 'index.html'
    }
    fs.readFile(p.resolve(publicPath,  fileName), (err, data) => {
        const fileType = mime.getType(fileName.split('.')[1]);
        response.setHeader('Content-Type', fileType);
        response.setHeader('Cache-Control', cacheTime);
        if (err) {
            if (err.errno === -2) {
                response.statusCode = 404;
                fs.readFile(p.resolve(publicPath, '404.html'), (err, data) => {
                    response.end(data);
                })
            } else {
                response.statusCode = 500;
                response.end('服务器正忙');
            }
            return;
        }
        response.end(data);
    })
});

server.listen(8080, () => {
    console.log('listening 8080');
});


