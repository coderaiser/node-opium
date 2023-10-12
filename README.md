# Opium [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL]

Unified file operations. Could be used to automate file operations on platforms powered by `node.js`.

### Install

```
npm i opium
```

### How to use?

```js
import montag from 'montag';

const opium = require('opium');
const commands = opium(montag`
    put --type directory --path /tmp/hello/world/why/not
    put --type file --path /tmp/hello/tmp.js --format base64 --data aGVsbG8=
`);

commands.on('error', (error) => {
    console.error(error.message);
    commands.abort();
});

commands.on('progress', (count) => {
    console.log(count);
});
```

### Example

```
drop --path /tmp/hello --files 1.txt,2.txt,3.txt
put --type file --format gzip --path /tmp/hello.txt --data "some data"
put --type directory --path /tmp/hello-dir
extract --from /tmp/hello.tar.gz --to /tmp/hello
pack --from /tmp/hello --to hello.tar.gz --files 1.txt,2.txt,3.txt
copy --from /tmp --to /tmp/2 --files 1.txt,2.txt,4.txt
move --from /tmp/1.txt --to /tmp/2.txt
```

## License

MIT

[NPMIMGURL]: https://img.shields.io/npm/v/opium.svg?style=flat
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/opium "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
