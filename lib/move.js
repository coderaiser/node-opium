(function() {
    'use strict';
    
    var flop = require('flop');
    
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
        var data    = {
            to: to,
            from: from,
            names: files
        };
        
        processFiles(data, flop.move, fn);
    }
    
    function processFiles(files, processFunc, callback) {
        var names           = files.names,
            
            process         = function() {
                var isLast, name,
                    from    = files.from,
                    to      = files.to;
                
                if (names) {
                    isLast  = !names.length,
                    name    = names.shift(),
                    from    += name;
                    to      += name;
                } else {
                    isLast  = false;
                    names   = [];
                }
                
                if (isLast)
                    callback();
                else
                    processFunc(from, to, function(error) {
                        if (error)
                            callback(error);
                        else
                            process();
                    });
            };
        
        process();
    }
})();
