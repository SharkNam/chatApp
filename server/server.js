//socket.emit chi gui user tuong tac sever
//io.emit gui tat ca cac user tuong tac or ko
//socket.broadest.emit gui den tat ca user tru thang gui
const express = require('express')
const path = require('path') //build-in rút gọn đường dẫn(xóa dấu /../)
const http = require('http'); //dựng server, giống như app = express()
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const Room = require('./models/Room');
const newRoom = new Room();

const { generateMessage, generateLocation } = require('./messageTemplate')

io.on("connection", (socket) => {
    console.log("Welcome") //user ket noi voi sever
    //emit: Event, Mesage; còn on: event, callback function bắt sự kiện đó 
    socket.on("joinRoom", msg => {
        const { name, room } = msg;
        newRoom.addUser(socket.id, name, room)

        socket.join(room)

        io.to(room).emit("serverMsg", generateMessage(
            "Admin",
            `${name} joined room`
        ))

        io.to(room).emit("userList", {
            userList: newRoom.findUsersInRoom(room)
        })

        socket.emit('Welcome', generateMessage( //nguio do da vo room roi nen ko can to
            "Admin",
            'Welcome to the chat app'
        ))

        socket.broadcast.to(room).emit('newUser', generateMessage(
            'Admin',
            'Co thang moi dzoooooo'
        ))

        socket.on('clientMsg', msg => {
            // console.log(msg)
            io.to(room).emit('serverMsg', generateMessage(
                msg.from,
                msg.content
            ))
        })

        socket.on("clientLocation", msg => {
            io.to(room).emit("serverLocation", generateLocation(
                msg.from,
                msg.lat, msg.lng
            ))
        })

        socket.on("disconnect", () => { //user thoat
            console.log("One user left")
            const user = newRoom.removeUserById(socket.id)
            io.to(room).emit("userList", {
                userList: newRoom.findUsersInRoom(room)
            })
            io.to(room).emit("serverMsg", generateMessage(
                "Admin",
                `${user.name} has left the room`))
        })
    })
})


const publicPath = path.join(__dirname + '/../public') //__dirname chứa đường dẫn tuyệt đối thư mực mà file đang chạy

app.use('/', express.static(publicPath))
const port = 3456;
server.listen(port, () => {
    console.log(`Server in running on port ${port}`)
})

// socket co che public SubtleCrypto
// 3 phuong thuc: socket.emit, io.emit, socket.broadcast.emit, to()
// moment.js
// template engine: mustaches