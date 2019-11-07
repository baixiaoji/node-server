#!/usr/bin/env node
const program = require('commander');
const pkg = require('./package.json');
const {kickOff} = require('./index');
program.version(pkg.version);


program
    .option('-p, --port <portNumber>', 'listen port number')
    .option('-c, --cache [cacheTime]', 'cache time [default to 10days]')
    .option('-d, --dirName [directory]', 'server in which directory [default to current dir]');

program.parse(process.argv);


export interface IArgs {
    [k: string]: string
}

kickOff(program.opts());
