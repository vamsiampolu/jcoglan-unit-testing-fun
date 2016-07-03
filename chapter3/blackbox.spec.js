JS.Test.describe('jQuery events(black-box)', function () {
  this.extend(HtmlFixture)
  this.fixture(' <p></p> <p></p> <p></p> ')
  this.before(function () {
    this.paras = this.fixture.find('p')
    this.second = this.paras.get(1)
  })
  this.it('invokes callback with this bound to the element', function (resume) {
    var self = this
    var reciever, event
    this.paras.on('click', function (e) {
      reciever = this
      event = e
    })
    syn.click(this.second, function () {
      resume(function () {
        self.assertSame(this.second, reciever)
        self.assertEqual(this.objectIncluding({target: this.second, type: 'click'}), event)
      })
    })
  })
})

JS.Test.describe('jQuery events(mock)', function () {
  this.extend(HtmlFixture)
  this.fixture(' <p></p> <p></p> <p></p> ')
  this.before(function () {
    this.paras = this.fixture.find('p')
    this.second = this.paras.get(1)
  })

  this.it('invokes a callback bound to the element', function (resume) {
    // on is used here to set an `expected` this binding
    var self = this
    this.expect(this, 'callback')
      .on(self.second)
      .given(self.objectIncluding({target: self.second, type: 'click'}))
      .exactly(1)
    this.paras.on('click', self.callback)
    syn.click(this.second, resume)
  })
})

JS.Test.autorun()
