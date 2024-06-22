const express = require('express');
const socketIO = require('socket.io');
const app = express();
const http = require('http');
const config = require('config');
const homeRoute = require('./routes/home');
// const HOST_BACKEND = require('./hostBackend.js');
const mongoose = require('mongoose');
const Message = require('./models/Message');        

///////////////// mongodb initialisee

const mongoAddress1 = `mongodb://localhost/news`;
const mongoAddress2 = `mongodb+srv://goranbelanovic:1234@cluster0.xneom.mongodb.net/chat?retryWrites=true&w=majority`;

// mongoose.set('useFindAndModify', false); 

mongoose.connect(mongoAddress2, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the chat databaseeee'))
  .catch(err => console.log(err))

////////////////////////////////////////9//////dsfsd



app.use(homeRoute);
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', async (socket) => {
  /* 
      socket.on('initial-rooms', (rooms) => {
        rooms.forEach(prom => {
          socket.join(prom);
        });
      }) */
  const messagesDB = await Message.find();

  const timeOfLastMessage = messagesDB[messagesDB.length - 1].milliseconds;
  const deletedMessages = await Message.deleteMany({milliseconds: {$lt: timeOfLastMessage - 660000} })

  socket.emit('messagesDB', messagesDB);

  socket.on('requestMessagesDB', () => socket.emit('messagesDB', messagesDB));

  socket.on('message', async (payload) => {

    /*  console.log(socket.rooms)
     let messageRoom;
     for(const prom in socket.rooms) {
       console.log(socket.rooms[prom])
       if(socket.rooms[prom] === payload.room) {
         messageRoom = socket.rooms[prom];
       }
     } */
    /* socket.join(payload.room); */

    const oneMessage = new Message(payload);

    try {
      const savedPayload = await oneMessage.save();
      io.emit('message', savedPayload);
    } catch (err) {
        console.log(err);
    }
  });

  socket.on('check', async (payload) => {
    const checkedMessage = await Message.findByIdAndUpdate(payload._id, {checked: payload.checked}, {new: true})
    io.emit('check', payload);
  });

})

app.get('/n', (req, res) => {
  res.send('chat server radi')
  res.end();

});


const hostIP = config.get('hostIP');
const port = process.env.PORT || 4001; 

server.listen(port, hostIP, () => console.log(`Server is listening on port ${port}`));



