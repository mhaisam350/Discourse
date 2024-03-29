const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const formatMessage = require('./utils/formatMessage');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
app.use(helmet());
app.use(cors());

// app.options('*', (req, res) => {
//     res.set('Access-Control-Allow-Origin', '*');
//     res.send('ok');
//   });
  
//   app.use((req, res) => {
//     res.set('Access-Control-Allow-Origin', '*');
//   });

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://192.168.18.13:3000', 'http://localhost:3000'],
    },
});

const automatedSender = 'Discourse';
const automatedMessageColor = '#FF0000'

// Set env file

dotenv.config({ path: './config.env' });
const PORT = process.env.PORT;

// Run on client connection

io.on('connection', (socket) => {

    // console.log(socket.id);

    socket.on('joinRoom', ({ username, room, color }) => {

        const user = userJoin(socket.id, username, room, color);
        // console.log(user);

        socket.join(user.room);

        socket.emit('message', formatMessage(automatedSender, 'Welcome to Discourse!', automatedMessageColor));

        socket.broadcast.to(user.room).emit('message', formatMessage(automatedSender, `${user.username} has joined the chat.`, automatedMessageColor));

        io.to(user.room).emit('roomUsers', getRoomUsers(user.room));

    });

    socket.on('chatMessage', ({ message, time }) => {

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, message, user.color, time));

    });

    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if (user) {

            io.to(user.room).emit('message', formatMessage(automatedSender, `${user.username} has left the chat.`, automatedMessageColor));

            io.to(user.room).emit('roomUsers', getRoomUsers(user.room));

        };

    });

});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));