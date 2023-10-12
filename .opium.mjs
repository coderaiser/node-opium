export default ({put, move}) => [
    put('/tmp/hello/world/why/not/'),
    put('/tmp/hello/tmp.js', 'hello'),
    move('/tmp/hello/', '/tmp/hello/world/', 'tmp.js'),
];

