var streams = require('stream')
var util = require('util')
var through = require('through')
var split = require('split')
var combine = require('stream-combiner')

var Source = function (chunks, interval) {
  streams.Readable.call(this)
  this._chunks = chunks
  this._index = 0
  this._interval = interval
}

util.inherits(Source, streams.Readable)

Source.prototype._read = function () {
  var self = this
  setTimeout(function () {
    if (self._index === self._chunks.length) {
      self.push(null)
    } else {
      self.push(self._chunks[self._index])
      self._index += 1
    }
  }, self._interval)
}

var Upcase = function () {
  streams.Transform.call(this)
}

util.inherits(Upcase, streams.Transform)

Upcase.prototype._transform = function (chunk, encoding, callback) {
  chunk = chunk.toString('utf8').toUpperCase()
  this.push(chunk)
  callback()
}

var Filter = function (query) {
  streams.Transform.call(this)
  this._query = query
}

util.inherits(Filter, streams.Transform)

Filter.prototype._transform = function (chunk, encoding, callback) {
  chunk = chunk.toString('utf8')
  if (chunk.indexOf(this._query) >= 0) {
    this.push(chunk)
  }
  callback()
}

var join = function (seperator) {
  return through(function (chunk) {
    this.push(chunk)
    this.push(new Buffer(seperator || '\n'))
  })
}

var Grep = function (query) {
  return combine(split('\n'), new Filter(query), join('\n'))
}

module.exports = {
  Source: Source,
  Upcase: Upcase,
  Grep: Grep,
  join: join,
  Filter: Filter
}
