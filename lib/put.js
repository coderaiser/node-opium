import {mkdir, writeFile} from 'node:fs';

export default (args, fn) => {
    if (!args.type)
        fn(Error('"type" could not be empty"'));
    else if (!args.path)
        fn(Error('"path" could not be empty"'));
    else if (args.type === 'file' && !args.format)
        fn(Error('"format" could not be empty"'));
    else if (args.type === 'file' && !args.data)
        fn(Error('"data" could not be empty"'));
    else
        processing(args.type, args.path, args.format, args.data, fn);
};

function processing(type, path, format, data, fn) {
    let buffer;
    
    switch(type) {
    case 'directory':
        mkdir(path, {recursive: true}, fn);
        break;
    
    case 'file':
        if (format !== 'base64') {
            fn(Error('format could be base64 only'));
        } else {
            buffer = Buffer.from(data, 'base64');
            writeFile(path, buffer, fn);
        }
        
        break;
    }
}
