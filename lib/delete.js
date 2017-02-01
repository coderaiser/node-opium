'use strict';

var remy = require('remy');

module.exports = function(args, fn) {
    if (!args.path)
        fn(Error('"path" could not be empty"'));
    else if (!args.files)
        fn(Error('"files" could not be empty"'));
    else
        processing(args.path, args.files.split(','), fn);
};

function processing(path, files, fn) {
    var rm, done;
    
    rm = remy(path, files);
    
    rm.on('error', function(error) {
        done = true;
        rm.abort();
        fn(error);
    });
    
    rm.on('end', function() {
        !done && fn();
    });
}

