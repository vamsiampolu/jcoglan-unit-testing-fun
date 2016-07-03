var EventEmitter = require('events').EventEmitter
var util = require('util')

var Announcer = function (prelude) {
  EventEmitter.call(this)
  this.prelude = prelude
}

util.inherits(Announcer, EventEmitter)

Announcer.prototype.announce = function (message) {
  this.emit('message', this.prelude + ', ' + message)
}

module.exports = Announcer
