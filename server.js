const express = require('express');
var path = require('path');
const app = express();
const server = require('http').createServer(app);

const io = require("socket.io")(server);
const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log('listening at port %d', port);
});

app.use(express.static(path.join(__dirname,'./public')));

io.on('connection', (socket) => {

  socket.on('add user', (username) => {
    //store username in socket session
    socket.username = username;

    // emit globally to all clients that user joined.
    io.emit('user joined', {
      username: socket.username 
    });
  });

  socket.on('chat message', (data) => {
    socket.broadcast.emit('chat message', {
      username: socket.username,
      message: data
    });
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('user left', { 
      username: socket.username 
    });
    
  });

});