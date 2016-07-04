var JS = require('jstest')
var samples = require('./streams')
var Source = samples.Source
var Upcase = samples.Upcase
var Filter = samples.Filter
var concat = require('concat-stream')

JS.Test.describe('Source events', function () {
  this.before(function () {
    this.stream = new Source(['a', 'b', 'c'], 10)
    this.stream.setEncoding('utf8')
  })
  this.it('yields output via the data event', function (resume) {
    var data = []
    this.stream.on('data', data.push.bind(data))
    this.stream.on('end', function () {
      resume(function () {
        this.assertEqual(['a', 'b', 'c'], data)
      })
    })
  })

  this.it('emits all the output', function (resume) {
    this.stream.pipe(concat(function (output) {
      resume(function () {
        this.assertEqual('abc', output)
      })
    }))
  })
})

JS.Test.describe('Upcase', function () {
  this.before(function () {
    this.source = new Source(['a', 'b', 'c'], 10)
  })

  this.it('transforms its input to upper case', function (resume) {
    var stream = this.source.pipe(new Upcase())
    stream.setEncoding('utf8')
    stream.pipe(concat(function (output) {
      resume(function () {
        this.assertEqual('ABC', output)
      })
    }))
  })

  this.it('pushes an uppercase string', function (resume) {
    var upcase = new Upcase()
    this.expect(upcase, 'push').given('WHAT UP')
    upcase._transform(new Buffer('what up'), 'utf8', resume)
  })
})

JS.Test.describe('filter', function () {
  this.before(function () {
    this.filter = new Filter('lo')
  })

  this.it('pushes chunks that matches the given query', function (resume) {
    this.expect(this.filter, 'push').given('hello')
    this.filter._transform(new Buffer('hello'), 'utf8', resume)
  })

  this.it('does not push chunks that do not match the query', function (resume) {
    this.expect(this.filter, 'push').exactly(0)
    this.filter._transform(new Buffer('goodbye'), 'utf8', resume)
  })
})

JS.Test.autorun()
