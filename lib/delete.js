'use strict';

const remy = require('remy');

module.exports = (args, fn) => {
    if (!args.path)
        return fn(Error('"path" could not be empty"'));
    
    if (!args.files)
        return fn(Error('"files" could not be empty"'));
   
    processing(args.path, args.files.split(','), fn);
};

function processing(path, files, fn) {
    remy(path, files)
        .on('error', fn)
        .on('end', fn);
}

