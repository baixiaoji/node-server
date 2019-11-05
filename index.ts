///<reference path="node_modules/@types/mime/index.d.ts"/>
import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as fs from "fs";
import * as p from 'path';
import * as url from "url";
import * as mime from 'mime';

const server = http.createServer();
const publicPath = p.resolve(__dirname, './public');
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const { url:path } = request;
    const {pathname} = url.parse(path);
    let fileName = pathname.slice(1);
    if (fileName === '') {
        fileName = 'index.html'
    }
    fs.readFile(p.resolve(publicPath,  fileName), (err, data) => {
        const fileType = mime.getType(fileName.split('.')[1]);
        if (err) {
            if (err.errno === -2) {
                response.statusCode = 404;
                fs.readFile(p.resolve(publicPath, '404.html'), (err, data) => {
                    response.setHeader('Content-Type', fileType);
                    response.end(data);
                })
            } else {
                response.statusCode = 500;
                response.end('服务器正忙');
            }
            return;
        }
        response.setHeader('Content-Type', fileType);
        response.end(data);
    })
});

server.listen(8080, () => {
    console.log('listening 8080');
});


