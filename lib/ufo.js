'use strict';

var minimist    = require('minimist'),
    util        = require('util'),
    rendy       = require('rendy'),
    Emitter     = require('events').EventEmitter,
    
    DIR         = './';

util.inherits(Opium, Emitter);

module.exports  = function(data, commands) {
    var Opium,
        defaultCommands = Opium.prototype._commands;
    
    if (typeof data !== 'string')
        throw Error('data should be string!');
    
    Opium = Opium(data);
    
    if (commands)
        Object.keys(commands).forEach(function(name) {
            if (defaultCommands[name])
                throw Error(Opium._tmpl.reserved);
            else
                Opium._commands[name] = commands[name];
        });
    
    return Opium;
};

function Opium(data) {
    var self = this;
    
    if (!(this instanceof Opium))
        return new Opium(data);
    
    this._commands  = data.split('\n');
    this._i         = 0;
    this._prev      = 0;
    this._n         = this._commands.length;
    
    Emitter.call(this);
    
    process.nextTick(function() {
        self._processing();
    });
}

Opium.prototype._processing   = function() {
    var msg, args, name,
        self        = this,
        commands    = this._commands,
        command     = commands.shift();
    
    if (!command) {
        this.emit('end');
    } else if (!this._paused) {
        ++this._i;
        
        command = command.split(' ');
        name    = command.shift();
        
        if (self._functions[name]) {
            args    = minimist(command);
            
            self._functions[name](args, function(error) {
                if (error)
                    self._error(Error(rendy(self._tmpl.line, {
                        command: name,
                        number: self._i,
                        msg: error.message
                    })));
                else
                    self._processing();
                
                self._progress();
            });
        } else {
            msg = rendy(self._tmpl.unknown, {
                number: this._i,
                name: name
            });
            
            self._error(msg);
            self._progress();
        }
    }
};

Opium.prototype._error        = function(error) {
    this.emit('error', error);
    this._paused = true;
};

Opium.prototype.abort        = function() {
    this._commands = [];
    this._processing();
};

Opium.prototype.continue     = function() {
    if (this._paused) {
        this._processing();
        this._paused = false;
    }
};

Opium.prototype._progress     = function() {
    var value = Math.round(this._i * 100 / this._n);
    
    if (value !== this._prev) {
        this._prev = value;
        this.emit('progress', value);
    }
};

Opium.prototype._tmpl         = {
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

Opium.prototype._commandList.forEach(function(name) {
    Opium.prototype._functions[name] = require(DIR + name);
});

