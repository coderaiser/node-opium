'use strict';

const {
    green,
    red,
    yellow,
} = require('chalk');

module.exports = (run) => {
    return run(commands).join('\n');
};

const commands = {
    put: (path) => green(`+ ${path}`),
    move: (from, to, files) => yellow(`* ${from} -> ${to} (${files})`),
    drop: (path, files) => red(`- ${path} (${files})`),
};
