const express = require('express');
const socketIO = require('socket.io');
const app = express();
const http = require('http');
const homeRoute = require('./routes/home');
const HOST_BACKEND = require('./hostBackend.js');

app.use(homeRoute);
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }});

io.on('connection', (socket) => {
    socket.on('message', (payload) => {
      io.emit('message', payload);
    });
    socket.on('check', (payload) => {
      io.emit('check', payload);
    });

})

const port = process.env.PORT || 4001;
server.listen(port, HOST_BACKEND, () => console.log(`Listening on port ${port}`));

