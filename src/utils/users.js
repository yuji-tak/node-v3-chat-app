const users = []

// ⭐️要件定義
// addUser, removeUser, get User, getUserInRoom

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
    // usernameとroomが未登録であることを確認
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

addUser({
  id: 22,
  username: 'Yuji',
  room: 'Osaka'
})
addUser({
  id: 22,
  username: 'Yuji2',
  room: 'Osaka'
})

removeUser(22)

console.log(users)
