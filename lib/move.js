'use strict';

const flop = require('flop');

module.exports = (args, fn) => {
    if (!args.from)
        return fn(Error('"from" could not be empty"'));
    
    if (!args.to)
        return fn(Error('"to" could not be empty"'));
    
    if (!args.files)
        return fn(Error('"files" could not be empty"'));
    
    processing(args.from, args.to, args.files.split(','), fn);
};

function processing(from, to, names, fn) {
    const data = {
        to,
        from,
        names,
    };
    
    processFiles(data, flop.move, fn);
}

function processFiles(files, processFunc, callback) {
    let names = files.names;
    const process = () => {
        let isLast, name;
        
        let from = files.from;
        let to = files.to;
        
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
            return callback();
        
        processFunc(from, to, (error) => {
            if (error)
                return callback(error);
            
            process();
        });
    };
    
    process();
}
