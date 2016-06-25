var request = require('request')
var app = require('./server')
var http = require('http')

var ServerSteps = {
  startServer: function (port, cb) {
    this.host = 'http://localhost:' + port
    this.server = http.createServer(app).listen(port, cb)
  },
  stopServer: function (cb) {
    this.server.close(cb)
  },
  clearData: function (cb) {
    request.del(this.host + '/', cb)
  },
  get: function (path, cb) {
    var self = this
    request(this.host + '/' + path, function (error, response, body) {
      self.response = response
      self.response.body = body
      cb()
    })
  },

  put: function (path, params, cb) {
    var self = this
    request.put(this.host + '/' + path, {form: params}, function (error, response, body) {
      self.response = response
      self.response.body = body
      cb()
    })
  },

  checkBody: function (body, cb) {
    this.assertEqual(body, this.response.body)
    cb()
  }
}

module.exports = ServerSteps
