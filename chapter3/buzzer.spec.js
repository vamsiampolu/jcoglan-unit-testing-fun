var JS = require('jstest')
var Buzzer = require('./buzzer')

JS.Test.describe('Buzzer', function () {
  this.before(function () {
    this.buzzer = new Buzzer()
    this.called = null
  })
  // just call the function and inspect the result, blackbox testing
  this.it('emits a buzz when pressed', function () {
    var self = this
    this.buzzer.on('buzz', function () {
      self.called = true
    })
    this.called = false
    this.buzzer.press()
    this.assert(this.called)
  })
})

JS.Test.describe('Buzzer(mocks)', function () {
  this.before(function () {
    this.buzzer = new Buzzer()
  })

  this.it('emits a buzz when pressed', function () {
    this.expect(this.buzzer, 'emit').given('buzz')
    this.buzzer.press()
  })
})

JS.Test.autorun()
