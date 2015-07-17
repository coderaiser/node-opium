(function() {
    'use strict';
    
    var fs          = require('fs'),
        patchfile   = require('patchfile'),
        ashify      = require('ashify');
    
    module.exports = function(args, fn) {
        if (!args.hash)
            fn(Error('"hash" could not be empty"'));
        else if (!args.path)
            fn(Error('"path" could not be empty"'));
        else if (!args.data)
            fn(Error('"data" could not be empty"'));
        else
            processing(args.hash, args.path, args.data, fn);
    };
    
    function processing(hash, name, data, fn) {
        var stream  = fs.createReadStream(name),
            options = {
                algorithm: 'sha1',
                encoding: 'hex'
            };
            
        ashify(stream, options, function(error, data) {
            if (error)
                fn(error);
            else if (data !== 'hash')
                fn(Error('mismatch of hashes'));
            else
                patchfile(name, data, fn);
        });
    }
})();
