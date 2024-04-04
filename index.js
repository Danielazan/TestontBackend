// const express = require("express")
// const { WebSocketServer } = require('ws')
// const url = require('url')

// const app = express();
// const port = 4000

// const server = app.listen(port, ()=>{
//     console.log("runing on port 4000")
// })

// const websocket = new WebSocketServer({server})

// websocket.on("connecton", (connection)=>{

// })

const http = require('http')
const uuidv4 = require('uuid').v4
const { WebSocketServer } = require('ws')
const express = require('express');
const url = require('url')

const app = express();
const server = http.createServer(app);

const wsServer = new WebSocketServer({ server })

const connections = {}

let messagess = {}

const broadcast = msg => {
  const Bmsg = Buffer.from(msg)

  omsg = Bmsg.toString('utf-8')

  Rmsg = JSON.parse(omsg)

  //  console.log(Rmsg)
  let userId = ''

  if (Rmsg.length > 0) {
    userId = Rmsg[0].user._id
    //    console.log(userId);
  }

  Object.keys(connections).forEach(userName => {
    const connection = connections[userName] 
    
     console.log(userName)

    if (userName !== userId) {
      connection.send(omsg)

      console.log('message sent')
    }
  })
}

wsServer.on('connection', (connection, request) => {
  const { userName } = url.parse(request.url, true).query

  const uuid = uuidv4()

  console.log(userName)
  // console.log(id)

  connections[userName] = connection

  // console.log(connections)

  connection.on('message', function incoming (message) {
    // console.log('received: %s', message);

    broadcast(message)

    //   connection.send('Welcome!');
  })
})

server.listen(8000, () => {
  console.log('WebSocket server connected on port 8000')
})
