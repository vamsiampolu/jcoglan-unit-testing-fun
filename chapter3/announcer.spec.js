var Announcer = require('./announcer')
var JS = require('jstest')

JS.Test.describe('Announcer', function () {
  this.before(function () {
    this.announcer = new Announcer('Attention passengers')
  })

  this.it('has an announce method', function () {
    this.assert(this.announcer.announce)
  })

  this.it('makes an announcement', function () {
    var self = this
    var expected = 'Attention passengers, there is free cake at the ticket office'
    var actual

    this.announcer.on('message', function (announcement) {
      actual = announcement
    })

    this.announcer.announce('there is free cake at the ticket office')
    this.assertEqual(expected, actual, 'Error')
  })
})

JS.Test.autorun()
