var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var http = require('http')

var app = express()
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

var storage = {}

app.get('/:id', function (req, res) {
  var id = req.params.id
  if (storage.hasOwnProperty(id)) {
    res.status(200).send(storage[id])
  } else {
    res.status(404).send('Not found')
  }
})

app.put('/:id', function (req, res) {
  var id = req.params.id
  storage[id] = req.body.value
  res.statusCode = 201
  res.send('Created')
})

app.delete('/', function (req, res) {
  storage = {}
  res.statusCode = 200
  res.send('Storage cleared')
})

// http.createServer(app).listen(3000, function () {
//   console.log('Server listening on http://localhost:3000')
// })

module.exports = app
