JS.Test.describe('Backbone Model(mock)', function () {
  var Person = Backbone.Model.extend({
    toString: function () {
      return 'Person{' + this.get('name') + '}'
    }
  })
  this.before(function () {
    this.person = new Person({name: 'Alice'})
  })
  this.it('emits events when attributes change', function () {
    this.expect(this.person, 'trigger').given('change:name', this.person, 'Merlin', {})
    this.expect(this.person, 'trigger').given('change:occupation', this.person, 'ceramicist', {})
    this.expect(this.person, 'trigger').given('change', this.person, {})
    this.person.set({name: 'Merlin',occupation: 'ceramicist'})
  })
})

JS.Test.describe('Backbone Model(spies)', function () {
  var Person = Backbone.Model.extend({
    toString: function () {
      return 'Person{' + this.get('name') + '}'
    }
  })
  this.before(function () {
    this.person = new Person({name: 'Alice'})
  })
  this.it('emits change:name event when the name attribute changes', function () {
    this.spy = sinon.spy(this.person, 'trigger')
    this.person.set({name: 'Merlin', occupation: 'ceramicist'})
    this.assert(this.spy.calledWith('change:name', this.person, 'Merlin', {}))
  })
  this.after(function () {
    this.spy.restore()
  })
})

JS.Test.autorun()
