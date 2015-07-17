# Opium [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL]

Unified file operations. Could be used to automate file operations on platforms powered by `node.js`.

### Install

```
npm i opium --save
```

### How to use?

```js
var opium       = require('opium'),

commands    = opium([
    'put --type directory --path /tmp/hello/world/why/not',
    'put --type file --path /tmp/hello/tmp.js --format base64 --data aGVsbG8=',
].join('\n'));
    
commands.on('error', function(error) {
    console.error(error.message);
    commands.abort();
});

commands.on('progress', function(count) {
    console.log(count);
});
```

### Example

```
delete --path /tmp/hello --files 1.txt,2.txt,3.txt
put --type file --format gzip --path /tmp/hello.txt --data
put --type directory --path /tmp/hello-dir
extract --from /tmp/hello.tar.gz --to /tmp/hello
pack --from /tmp/hello --to hello.tar.gz --files 1.txt,2.txt,3.txt
copy --from /tmp --to --to /tmp/2 --files 1.txt,2.txt,4.txt
move --from /tmp/1.txt --to /tmp/2.txt
```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/opium.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/gemnasium/coderaiser/node-opium.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/opium "npm"
[DependencyStatusURL]:      https://gemnasium.com/coderaiser/node-opium "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

