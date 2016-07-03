var Widget = function (container) {
  this._links = container.find('a')
  this._heading = container.find('h2')

  var self = this
  this._links.on('click', function (e) {
    e.preventDefault()
    var linkText = $(this).text()
    self.changeHeading(linkText)
  })
}

Widget.prototype.changeHeading = function (text) {
  this._heading.text(text)
}

JS.Test.describe('changeHeading()', function () {
  this.extend(HtmlFixture)
  this.fixture(' <h2></h2>')
  this.it('changes the heading text', function () {
    var widget = new Widget(this.fixture)
    widget.changeHeading('Welcome to Coventry')
    this.assertEqual('Welcome to Coventry', this.fixture.text().trim())
  })
})

JS.Test.describe('changes the heading to the link text', function () {
  this.extend(HtmlFixture)
  this.fixture('<a href="/">Home</a>')
  this.it('changes the heading to the link text', function (resume) {
    var widget = new Widget(this.fixture)
    this.expect(widget, 'changeHeading').given('Home')
    var link = this.fixture.find('a').get(0)
    syn.click(link, resume)
  })
})

JS.Test.autorun()
