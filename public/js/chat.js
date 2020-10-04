// client side
const socket = io()

// ⭐️countUP
// socket.on('countUpdated', (count) => {
//   console.log('The count has been updated!', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('Clicked!')
//   socket.emit('increment')
// })

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButoon = $messageForm.querySelector('button')

socket.on('message', (message) => {
  console.log(message)
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  $messageFormButoon.setAttribute('disabled', 'disabled')

  const message = e.target.elements.msg.value
  // ↑上記へ書き換え
  // const message = document.querySelector('input').value

  // 空欄の排除
  if (!message) {
    return
  }

  socket.emit('sendMessage', message, (error) => {
    $messageFormButoon.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      return console.log(error)
    }

    console.log('Message delivered!')
  })
})

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('not supported by your browser.')
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      console.log('Location shared!')
    })
  })
})
