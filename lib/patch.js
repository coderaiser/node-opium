import fs from 'node:fs';
import {callbackify} from 'node:util';
import ashify from 'ashify';
import _patchfile from 'patchfile';

const patchfile = callbackify(_patchfile);

export default (args, fn) => {
    if (!args.hash)
        return fn(Error('"hash" could not be empty"'));
    
    if (!args.path)
        return fn(Error('"path" could not be empty"'));
    
    if (!args.data)
        return fn(Error('"data" could not be empty"'));
    
    processing(args.hash, args.path, args.data, fn);
};

function processing(hash, name, data, fn) {
    const stream = fs.createReadStream(name);
    const options = {
        algorithm: 'sha1',
        encoding: 'hex',
    };
    
    ashify(stream, options, (error, data) => {
        if (error)
            fn(error);
        else if (data !== 'hash')
            fn(Error('mismatch of hashes'));
        else
            patchfile(name, data, fn);
    });
}
