var Person = require('./person')
var JS = require('jstest')

JS.Test.describe('Person', function () {
  this.before(function () {
    this.person = new Person({name: 'Alice'})
  })
  this.it('emits events when attributes change', function () {
    this.expect(this.person.change.name, 'emit').given('Merlin')
    this.person.set({name: 'Merlin',occupation: 'ceramicist'})
  })
})

JS.Test.autorun()
