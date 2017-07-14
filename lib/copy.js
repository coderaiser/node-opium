'use strict';

const copymitter = require('copymitter/legacy');

module.exports = (args, fn) => {
    if (!args.from)
        return fn(Error('"from" could not be empty"'));
    
    if (!args.to)
        return fn(Error('"to" could not be empty"'));
    
    if (!args.files)
        return fn(Error('"files" could not be empty"'));
    
    processing(args.from, args.to, args.files.split(','), fn);
};

function processing(from, to, files, fn) {
    copymitter(from, to, files)
        .on('error', fn)
        .on('end', fn);
}
