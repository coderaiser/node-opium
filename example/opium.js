'use strict';

const opium = require('..');
const {
    mkdir,
    writeFile,
    move,
} = require('../commands');

const noop = () => {};
const commands = [
    mkdir('/tmp/hello/world/why/not'),
    writeFile('/tmp/hello/tmp.js', 'hello'),
    move('/tmp/hello', '/tmp/hello/world', 'tmp.js'),
];

const processing = opium(commands);

processing.on('progress', console.log);
processing.on('end', () => {
    console.log('done');
});
processing.on('error', () => {
    commands.abort();
});

processing
    .done()
    .then(() => {
        console.log('promise done');
    });
