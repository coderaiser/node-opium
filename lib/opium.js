'use strict';

const {inherits} = require('util');
const process = require('process');

const minimist = require('minimist');
const rendy = require('rendy');
const Emitter = require('events').EventEmitter;
const noop = () => {};
const {keys} = Object;
const isString = (a) => typeof a === 'string';

const DIR = './';

inherits(Opium, Emitter);

module.exports = (data, commands) => {
    const defaultCommands = Opium.prototype._commands;
    
    if (!isString(data))
        throw Error('data should be string!');
    
    const opium = Opium(data);
    
    if (commands)
        for (const name of keys(commands)) {
            if (defaultCommands[name])
                throw Error(Opium._tmpl.reserved);
            
            Opium._commands[name] = commands[name];
        }
    
    return opium;
};

function Opium(data) {
    if (!(this instanceof Opium))
        return new Opium(data);
    
    this._commands = data.split('\n');
    this._i = 0;
    this._prev = 0;
    this._n = this._commands.length;
    this._resolve = noop;
    this._reject = noop;
    
    Emitter.call(this);
    
    process.nextTick(() => {
        this._processing();
    });
}

Opium.prototype.then = (fn) => {
    this._resolve = fn;
};

Opium.prototype.catch = (fn) => {
    this._resolve = fn;
};

Opium.prototype._processing = function() {
    let msg;
    let args;
    let name;
    const commands = this._commands;
    let command = commands.shift();
    
    if (!command) {
        this._resolve();
        this.emit('end');
        
        return;
    }
    
    if (!this._paused) {
        ++this._i;
        
        command = command.split(' ');
        name = command.shift();
        
        if (this._functions[name]) {
            args = minimist(command);
            
            this._functions[name](args, (error) => {
                if (error)
                    this._error(Error(rendy(this._tmpl.line, {
                        command: name,
                        number: this._i,
                        msg: error.message,
                    })));
                else
                    this._processing();
                
                this._progress();
            });
        } else {
            msg = rendy(this._tmpl.unknown, {
                number: this._i,
                name,
            });
            
            this._error(msg);
            this._progress();
        }
    }
};

Opium.prototype._error = function(error) {
    this.emit('error', error);
    this._paused = true;
    this._reject(error);
};

Opium.prototype.abort = function() {
    this._commands = [];
    this._processing();
};

Opium.prototype.continue = function() {
    if (this._paused) {
        this._processing();
        this._paused = false;
    }
};

Opium.prototype._progress = function() {
    const value = Math.round(this._i * 100 / this._n);
    
    if (value !== this._prev) {
        this._prev = value;
        this.emit('progress', value);
    }
};

Opium.prototype._tmpl = {
    line: 'line {{ number }} {{ command }}: {{ msg }}',
    unknown: 'line {{ number }}: unknown command "{{ name }}"',
    reserved: 'command names reserved: ' + Opium.prototype._commandList,
};

Opium.prototype._commandList = [
    'put',
    'patch',
    'delete',
    'pack',
    'extract',
    'copy',
    'move',
];

Opium.prototype._functions = {};

for (const name of Opium.prototype._commandList) {
    Opium.prototype._functions[name] = require(DIR + name);
}
