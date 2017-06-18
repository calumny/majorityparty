var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('user join', function(msg){
    var nick = msg.trim();
    if (nick.length < 16) {
      socket.nickname = nick;
      socket.emit('successfully registered', nick);
    }
  });

  socket.on('join room', function(msg){
    var roomName = msg.trim().toLowerCase();
    if (roomName.length == 4) {
      socket.join(roomName);
      socket.emit('successfully joined room');
      console.log(socket.nickname + " joined room " + roomName);
    } else {
      socket.emit('invalid room');
    }
  });

  socket.on('join public room', function(){
    var roomName = 'test room';
    socket.emit('successfully joined room');
    console.log(socket.nickname + " joined room " + roomName);
  });

  socket.on('chat message', function(msg){
    msg["time"] = new Date().getTime();
    msg["username"] = socket.nickname;
    io.emit('chat message',  msg);
  });

});

http.listen(80, function(){
  console.log('listening on *:80');
});
