// server side
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
// bad-words library
const Filter = require('bad-words')
// module.exports
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New Websocket connection')

  // ⭐️countUP
  // let count = 0
  // socket.emit('countUpdated', count)

  // socket.on('increment', () => {
  //   count++
  //   // socket.emit('countUpdated', count)
  //   io.emit('countUpdated', count)
  // })

  socket.emit('message', generateMessage('Welcome!'))

  // Broadcasting Event
  socket.broadcast.emit('message', generateMessage('A new user has joined!'))

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter()

    // 真偽値を返す
    if (filter.isProfane(message)) {
      // 条件がfalseを返した場合、callback関数の引数に文字列をとり、クライアント側へ送信
      return callback('Profanity is not allowed!')
    }

    io.emit('message', generateMessage(message))
    callback()
  })

  // Disconnect Event
  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'))
  })

  // 高階関数の第二引数callbackは、クライアントサイドから高階関数を受け取っている
  socket.on('sendLocation', (coords, callback) => {
    io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

    callback()
  })

})

// 🍔Server Listen
server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})
