var ServerSteps = require('./serversteps')
var JS = require('jstest')

JS.Test.describe('Storage Server(Callbacks)', function () {
  this.include(ServerSteps)
  this.before(function (resume) {
    this.startServer(4180, resume)
  })
  this.after(function (resume) {
    this.stopServer(resume)
  })
  this.it('saves and retrieves a value', function (resume) {
    var self = this
    this.put('meaning_of_life', {value: '42'}, function () {
      self.get('meaning_of_life', function () {
        resume(function (resume) {
          self.checkBody('42', resume)
        })
      })
    })
  })
  this.it('deletes all the data', function (resume) {
    var self = this
    this.put('meaning_of_life', {value: '42'}, function () {
      self.clearData(function () {
        self.get('meaning_of_life', function () {
          resume(function (resume) {
            self.checkBody('Not found', resume)
          })
        })
      })
    })
  })
})

JS.Test.autorun()
