const { create } = require('combined-stream');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'] // Add the necessary methods here
  }
});

const uuid = require('uuid');

/*
    rooms = {
        roomid: {
            roomName: '',
            roomOwner: '',
            roomMembers: [],
            roomMessages: [], <- 20 previous messages only
            roomCreated: '',
        }
    }
*/

let users = {};
let rooms = {};

function addUser(socket) {
  const userid = uuid.v4();
  const userObject = {
    userid: userid,
    socketId: socket.id,
    username: '',
    room: '',
    connectionTime: new Date().toLocaleString(),
  }
  users[socket.id] = userObject;
}

function removeUser(socket) {
    delete users[socket.id];
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
    console.log('a user connected');
  
    addUser(socket);

    console.log(users);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket);
    });

    socket.on('joinRoom', (roomid) => {
        users[socket.id].room = roomid;
        socket.join(roomid);
        console.log(users[socket.id]);``
    });

    socket.on('updateUsername', (username) => {
        users[socket.id].username = username;
        console.log(users[socket.id]);
    });

    socket.on('sendMessage', (message) => {
        const roomid = users[socket.id].room;
        const username = users[socket.id].username;
        const userid = users[socket.id].userid;
        const time = new Date().toLocaleString();

        if(!rooms[roomid]) {
            return;
        }

        const messageObject = {
            userid: userid,
            username: username,
            logo: '',
            message: message,
            sentTime: time,
            userLevel: 0,
        }

        rooms[roomid].roomMessages.push(messageObject);
        io.to(roomid).emit('receiveMessage', messageObject);
    });

});

server.listen(2553, () => {
  console.log(`Example app listening at http://localhost:${2553}`);
});
