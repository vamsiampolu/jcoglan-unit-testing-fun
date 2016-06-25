var JS = require('jstest')
var async = require('async')
var steps = require('./serversteps')

JS.Test.describe('Storage Server (async series)', function () {
  this.include(steps)
  this.before(function (resume) {
    var self = this
    async.series([
      function (cb) { self.startServer(4180, cb) }
    ], resume)
  })

  this.after(function (resume) {
    var self = this
    async.series([
      function (cb) {self.stopServer(cb)}
    ], resume)
  })

  this.it('saves and retrieves a value', function (resume) {
    var self = this
    async.series([
      function (cb) {self.put('meaning_of_life', {value: '42'}, cb)},
      function (cb) {self.get('meaning_of_life', cb)},
      function (cb) {self.checkBody('42', cb)}
    ], resume)
  })

  this.it('deletes all values', function (resume) {
    var self = this
    async.series([
      function (cb) { self.put('meaning_of_life', {value: '42'}, cb) },
      function (cb) { self.clearData(cb) },
      function (cb) { self.get('meaning_of_life', cb) }
    ], resume)
  })
})

JS.Test.autorun()
