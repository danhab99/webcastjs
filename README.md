# webcastjs

![npm bundle size](https://img.shields.io/bundlephobia/min/webcastjs?style=flat-square)
![npm](https://img.shields.io/npm/dw/webcastjs?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/danhab99/webcastjs?style=flat-square)
![NPM](https://img.shields.io/npm/l/webcastjs?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/danhab99/webcastjs?style=flat-square)
![npm](https://img.shields.io/npm/v/webcastjs?style=flat-square)

A nodejs implementation of [webcast.js](https://webcast.github.io/)

- [webcastjs](#webcastjs)
  - [Install](#install)
  - [Usage](#usage)
    - [As a client](#as-a-client)
      - [new Client(address, hello) extends Writable](#new-clientaddress-hello-extends-writable)
      - [Client.sendMeta(data)](#clientsendmetadata)
    - [As a server](#as-a-server)
      - [new class Server(opts) extends EventEmitter](#new-class-serveropts-extends-eventemitter)
      - [emits connection(ws)](#emits-connectionws)
        - [ws emits](#ws-emits)

## Install

```bash
npm i webcastjs
```

## Usage

`webcastjs` provides a client and a server

### As a client

```javascript
const { Client } = require('webcastjs')

var client = new Client('ws://localhost:3000', {
  // Insert hello object
})

client.sendMeta({
  title: 'some random title',
  anythingElse: "it's up to you"
})
someArbitraryReadableStream.pipe(client)
```

#### new Client(address, hello) extends Writable

Creates a new client object. Client objects can be used as a writable stream.

- `address`: a `ws://` address for the server
- `hello`: a hello object as described [here](https://github.com/webcast/webcast.js/blob/master/SPECS.md#hello)

#### Client.sendMeta(data)

Broadcast arbitrary metadata

- `data`: anything

### As a server

The webcast `Server` is a modification on the standard `ws.Server`. Websockets will be emitted like a regular `ws.Server` while receiving an error handling filter in compliance with [webcast.js specs](https://github.com/webcast/webcast.js/blob/master/SPECS.md).

```javascript
const { Server } = require('webcastjs')
const WebSocket = require('ws')

var server = new Server({ port: 3000 })})

server.on('connection', ws => {
  ws.on('hello', hello => {
    console.log('Hello', hello)
  })

  ws.on('close', () => console.log('Closed'))

  WebSocket.createWebSocketStream(ws).pipe(process.stdout)
})
```

#### new class Server(opts) extends EventEmitter

Creates a new webcast `Server`

- `opts`: See [WebSocket.Server\['Options'\]]([WebSocket](https://github.com/websockets/ws/blob/HEAD/doc/ws.md#new-websocketserveroptions-callback))

#### emits connection(ws)

Emits whenever a new connection is successfully established

- `ws`: the websocket

##### ws emits

The websocket is modified to emit unique events

- `hello`: the first hello message
- `metadata`: a change in metadata
- `frame`: a valid webcast.js frame