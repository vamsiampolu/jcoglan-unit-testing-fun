var EventEmitter = require('events').EventEmitter
var util = require('util')
var Buzzer = function () {
  EventEmitter.call(this)
}

util.inherits(Buzzer, EventEmitter)

Buzzer.prototype.press = function () {
  this.emit('buzz')
}

module.exports = Buzzer
