const WebSocket = require('ws')
const EventEmitter = require('events')

module.exports = class Server extends EventEmitter {
  constructor(opts) {
    super()

    this.wss = new WebSocket.Server(opts)
    this.wss.on('connection', ws => {
      var hello = undefined

      ws.on('message', msg => {
        var frame = msg

        if (!(msg instanceof Buffer)) {
          frame = JSON.parse(msg)
          if ( !('type' in frame) || !('data' in frame) ) {
            throw new Error('Frame does not comply with schema')
          }
        }

        if (hello == undefined && !(msg instanceof Buffer)) {
          if (frame.type == 'hello') {
            hello = frame.data
            ws.emit('hello', hello)
          }
          else {
            hello = null
            ws.close()
          }

          return
        }

        if (hello == null) {
          ws.close()
        }
      })

      this.emit('connection', ws)
    })
  }
}