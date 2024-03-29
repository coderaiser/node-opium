import {move} from 'flop';

export default (args, fn) => {
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
    
    processFiles(data, move, fn);
}

function processFiles(files, processFunc, callback) {
    let {names} = files;
    const process = () => {
        let isLast;
        let name;
        let {from, to} = files;
        
        if (names) {
            isLast = !names.length;
            name = names.shift();
            from += name;
            to += name;
        } else {
            isLast = false;
            names = [];
        }
        
        if (isLast)
            return callback();
        
        processFunc(from, to)
            .then(process)
            .catch(callback);
    };
    
    process();
}
