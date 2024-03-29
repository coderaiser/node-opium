import chalk from 'chalk';

const {
    green,
    red,
    yellow,
} = chalk;

export default (run) => {
    return run(commands).join('\n');
};

const commands = {
    put: (path) => green(`+ ${path}`),
    move: (from, to, files) => yellow(`* ${from} -> ${to} (${files})`),
    drop: (path, files) => red(`- ${path} (${files})`),
};
