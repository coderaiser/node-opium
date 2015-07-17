(function() {
    'use strict';
    
    var copymitter = require('copymitter');
    
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
        var cp, done;
        
        cp = copymitter(from, to, files);
        
        cp.on('error', function(error) {
            done = true;
            cp.abort();
            fn(error);
        });
        
        cp.on('end', function() {
            !done && fn();
        });
    }
})();
