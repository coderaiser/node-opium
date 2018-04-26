'use strict';

const minimist = require('minimist');
const util = require('util');
const rendy = require('rendy');
const Emitter = require('events').EventEmitter;

const DIR = './';

util.inherits(Opium, Emitter);

module.exports = (data, commands) => {
    const defaultCommands = Opium.prototype._commands;
    
    if (typeof data !== 'string')
        throw Error('data should be string!');
    
    const opium = Opium(data);
    
    if (commands)
        Object.keys(commands).forEach((name) => {
            if (defaultCommands[name])
                throw Error(Opium._tmpl.reserved);
            
            Opium._commands[name] = commands[name];
        });
    
    return opium;
};

function Opium(data) {
    if (!(this instanceof Opium))
        return new Opium(data);
    
    this._commands  = data.split('\n');
    this._i         = 0;
    this._prev      = 0;
    this._n         = this._commands.length;
    
    Emitter.call(this);
    
    process.nextTick(() => {
        this._processing();
    });
}

Opium.prototype._processing   = function() {
    let msg, args, name;
    const commands = this._commands;
    let command = commands.shift();
    
    if (!command)
        return this.emit('end');
    
    if (!this._paused) {
        ++this._i;
        
        command = command.split(' ');
        name    = command.shift();
        
        if (this._functions[name]) {
            args    = minimist(command);
            
            this._functions[name](args, (error) => {
                if (error)
                    this._error(Error(rendy(this._tmpl.line, {
                        command: name,
                        number: this._i,
                        msg: error.message
                    })));
                else
                    this._processing();
                
                this._progress();
            });
        } else {
            msg = rendy(this._tmpl.unknown, {
                number: this._i,
                name: name
            });
            
            this._error(msg);
            this._progress();
        }
    }
};

Opium.prototype._error = function(error) {
    this.emit('error', error);
    this._paused = true;
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
    line    : 'line {{ number }} {{ command }}: {{ msg }}',
    unknown : 'line {{ number }}: unknown command "{{ name }}"',
    reserved: 'command names reserved: ' + Opium.prototype._commandList
};

Opium.prototype._commandList = [
    'put',
    'patch',
    'delete',
    'pack',
    'extract',
    'copy',
    'move'
];

Opium.prototype._functions     = {
};

Opium.prototype._commandList.forEach((name) => {
    Opium.prototype._functions[name] = require(DIR + name);
});

