'use strict';

var opium       = require('..'),
    commands    = opium([
        'put --type directory --path /tmp/hello/world/why/not',
        'put --type file --path /tmp/hello/tmp.js --format base64 --data aGVsbG8=',
        'patch --hash bb27f5fa7f50d9747525754f9d14c63187cc2959 --path /tmp/hello/tmp.js --data QEAgLTMwMywxNiArMzAzLDE3IEBACiAtZGF0YSAnIAorIAogJTBBICAgICAgIAo='
    ].join('\n'));

commands.on('error', function(error) {
    console.error(error.message);
    commands.abort();
});
