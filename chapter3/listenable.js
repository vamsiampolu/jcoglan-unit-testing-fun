function Listenable (object) {
  this._object = object
  this._listeners = []
}

Listenable.prototype.listen = function (listener) {
  this._listener.push(listener)
}

Listenable.prototype.emit = function () {
  for (var i = 0;i < this._listeners.length;i++) {
    this._listeners.apply(this._object, arguments)
  }
}

module.exports = Listenable
