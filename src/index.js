// server side
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
// bad-words library
const Filter = require('bad-words')
// module.exports
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

// ⭐️socket start!
io.on('connection', (socket) => {
  console.log('New Websocket connection')

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options })

    if (error) {
      return callback(error)
    }

    socket.join(user.room)

    // 推測だが、第一引数に仮値を渡しておかないとHTMLの出力時にデータがズレる
    socket.emit('message', generateMessage('Admin', 'Welcome!'))
    // Broadcasting Event
    // to()で、room名をキーに複数分岐させる
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    const filter = new Filter()

    // 真偽値を返す
    if (filter.isProfane(message)) {
      // 条件がfalseを返した場合、callback関数の引数に文字列をとり、クライアント側へ送信
      return callback('Profanity is not allowed!')
    }

    io.to(user.room).emit('message', generateMessage(user.username, message))
    callback()
  })

  // Disconnect Event
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${ user.username } has left!`))
    }
  })

  // 高階関数の第二引数callbackは、クライアントサイドから高階関数を受け取っている
  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

    callback()
  })

})

// 🍔Server Listen
server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})
