export default ({put, move, drop}) => [
    put('/tmp/hello/world/why/not/'),
    put('/tmp/hello/tmp.js', 'hello'),
    move('/tmp/hello/', '/tmp/hello/world/', 'tmp.js'),
    drop('/tmp/hello/world/why/not/', '2.js'),
    drop('/tmp/hello/world/why/xxx/', '1.js'),
];

