const users = []

// ⭐️要件定義
// addUser, removeUser, getUser, getUserInRoom

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required!'
    }
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    // usernameとroomの2項目が未登録であることを確認
    return user.room === room && user.username === username
  })

  // Validate username
  if (existingUser) {
    return {
      error: 'Username is in use!'
    }
  }

  // Store user
  const user = { id, username, room }
  users.push(user)
  return { user }

}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase()
  return users.filter((user) => user.room === room)
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}

// addUser({
//   id: 1,
//   username: 'Yuji1',
//   room: 'Osaka'
// })
// addUser({
//   id: 2,
//   username: 'Yuji2',
//   room: 'Osaka'
// })
// addUser({
//   id: 3,
//   username: 'Yuji3',
//   room: 'Tokyo'
// })

// const user = getUser(1)
// console.log(user)

// const userList = getUsersInRoom('Osaka')
// console.log(userList)
