'use strict';

var remy = require('remy/legacy');

module.exports = function(args, fn) {
    if (!args.path)
        fn(Error('"path" could not be empty"'));
    else if (!args.files)
        fn(Error('"files" could not be empty"'));
    else
        processing(args.path, args.files.split(','), fn);
};

function processing(path, files, fn) {
    remy(path, files)
        .on('error', fn)
        .on('end', fn);
}

