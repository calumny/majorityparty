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
      socket.join("test room");
      socket.nickname = nick;
      socket.emit('successfully registered', nick);
      console.log(nick + " joined test room");
    }
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
