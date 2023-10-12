import opium from '../lib/opium.js';
import commands from '../lib/commands.js';

const dir = process.cwd();
const {default: parseScript} = await import(`${dir}/.opium.mjs`);

const script = parseScript(commands);
const processing = opium(script);

processing.on('progress', console.log);
processing.on('end', () => {
    console.log('done');
});

processing.on('error', (error) => {
    console.log(error);
    processing.abort();
});

processing.done().then(() => {
    console.log('promise done');
});

