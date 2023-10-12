'use strict';

const rendy = require('rendy');
const opium = require('..');
const noop = () => {};

const commands = [
    mkdir('/tmp/hello/world/why/not'),
    writeFile('/tmp/hello/tmp.js', 'hello'),
];

const processing = opium(commands);

processing.on('progress', console.log);
processing.on('end', () => {
    console.log('done');
});
processing.on('error', () => {
    commands.abort();
});

function mkdir(path) {
    return rendy(`put --type directory --path {{ path }}`, {
        path,
    });
}

function writeFile(path, data) {
    const values = {
        path,
        data,
    };
    
    return rendy(`put --type file --path {{ path }} --format base64 --data {{ data | btoa }}`, values, {
        btoa,
    });
}
