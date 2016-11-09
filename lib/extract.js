'use strict';

var jaguar = require('jaguar/legacy');

module.exports = function(args, fn) {
    if (!args.from)
        fn(Error('"from" could not be empty"'));
    else if (!args.to)
        fn(Error('"to" could not be empty"'));
    else if (!args.files)
        fn(Error('"files" could not be empty"'));
    else
        processing(args.from, args.to, args.files.split(','), fn);
};

function processing(from, to, files, fn) {
    var pack = jaguar.extract(from, to, files);
    
    pack.on('error', function(error) {
        fn(error);
    });
    
    pack.on('end', function() {
        fn();
    });
}
