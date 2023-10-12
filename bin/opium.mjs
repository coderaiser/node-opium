import opium from '../lib/opium.js';
import commands from '../lib/commands.js';
import process from 'node:process';
import {promisify} from 'node:util';
import report from '../lib/report.js';

const dir = process.cwd();
const [arg] = process.argv.slice(2);

const run = promisify((runScript, fn) => {
    const script = runScript(commands);
    const processing = opium(script);
    
    processing.on('progress', (count) => {
        process.stdout.write(`\r${count}%`);
    });
    processing.on('end', () => {
        console.log('✅');
        process.exit();
    });
    
    processing.on('error', (error) => {
        console.error(`\r❌ [:${error.line}] ${error.command}: ${error.originalMessage}`);
        process.exit(1);
    });
});

const {default: runScript} = await import(`${dir}/.opium.mjs`);

if (arg === 'run') {
    await run(runScript);
    process.exit();
}

console.log(report(runScript));
