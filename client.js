const ws = require('ws')
const { Writable } = require('stream')

module.exports = class Client extends Writable {
  constructor(address, opts) {
    super()

    this.ws = new ws(address, 'webcast')
    this.ws.once('open', () => {
      this.ws.send(JSON.stringify({
        type: "hello",
        data: opts
      }))
    })
    
  }

  _send(d) {
    if (this.ws.readyState == ws.OPEN) {
      this.ws.send(d)
    }
  }

  _sendText(type, data) {
    this._send(JSON.stringify({
      type, data
    }))
  }

  _sendBinary(data) {
    this._send(data)
  }

  _write(chunk, encoding, done) {
    this._sendBinary(chunk)
    done()
  }

  sendMeta(data) {
    this._sendText('metadata', JSON.stringify(data))
  }
}