var async = require('async')
var curry = require('./curry')
var JS = require('jstest')
var steps = require('./serversteps')
steps = curry.object(steps)

JS.Test.describe('Storage Server(Continuables)', function () {
  this.include(steps)
  this.before(function (resume) {
    async.series([this.startServer], resume)
  })

  this.after(function (resume) {
    async.series([this.stopServer], resume)
  })

  this.it('puts and gets data', function (resume) {
    async.series([
      this.put('mol', {value: 42}),
      this.get('mol'),
      this.checkBody('42')
    ], resume)
  })

  this.it('deletes all data', function (resume) {
    async.series([
      this.put('mol', {value: 42}),
      this.clearData(),
      this.get('mol')
    ], resume)
  })
})

JS.Test.autorun()
