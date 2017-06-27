var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var roomStates = {lobby:'lobby',
                  preparingGame:'preparingGame',
                  announceCandidates:'announceCandidates',
                  discussCandidates:'discussCandidates',
                  election:'election',
                  announcePresident:'announcePresident',
                  presidency:'presidency',
                  gameResults:'gameResults' };

// Global game settings
var rooms = {};
var minScoreToWin = 15;
var hackerPowers = ["deludeCandidate", "revealCandidateScore", "callImmediateVote", "changeVote", "cancelVote"];
var presidentPowers = ["jailCitizen", "investigateRussian", "callRecount"];
var candidateScores = [1, 2, 2, 3, 3, 5];
var minPlayerCount = 6;


function createRoom(roomName) {
  if (rooms[roomName] != undefined) {
    throw 'room already exists';
  } else {
    var newRoom = { state:roomStates.lobby,
                    electionCount:0,
                    redScore:0,
                    blueScore:0,
                    scoreToWin:minScoreToWin,
                    players:{},
                    redTeam:[],
                    blueTeam:[],
                    hackerTeam:[],
                    redCandidate:null,
                    blueCandidate:null,
                    hacksAvailable:hackerPowers,
                    presidentPowers:presidentPowers,
                    jailedPlayers:[],
                    redScoresRemaining:candidateScores,
                    blueScoresRemaining:candidateScores,
                    currentVote:{},
                    hackInUse:null
                  };
      rooms[roomName] = newRoom;
  }
}

function getUniqueNickname(nicks, originalNickname, newNickname, numberAppend) {
  if (nicks.indexOf(newNickname) > -1) {
    return getUniqueNickname(nicks, originalNickname, originalNickname + numberAppend, numberAppend + 1);
  } else {
    return newNickname;
  }
}

function addPlayerToRoom(roomName, socket) {
  if (rooms[roomName]!=undefined) {
    var room = rooms[roomName];
    var roomPlayers = room.players;
    var nicks = Object.keys(roomPlayers).map(function(key) {
        return roomPlayers[key];
    });
    roomPlayers[socket.id] = getUniqueNickname(nicks, socket.nickname, socket.nickname, 2);
    room.players = roomPlayers;
  } else {
    throw 'no such room';
  }

}

function joinRoom(roomName, socket) {
  socket.join(roomName);
  // try {
    addPlayerToRoom(roomName, socket);
    var playerNicks = Object.keys(rooms[roomName].players).map(function(key) {
        return rooms[roomName].players[key];
    });
    socket.emit('successfully joined room', playerNicks);
    socket.broadcast.to(roomName).emit('new player joined room', playerNicks);
    if (playerNicks.length >=  minPlayerCount) {
      io.to(roomName).emit('enough players');
    }
    console.log(socket.nickname + " joined room " + roomName);
  // } catch (err) {
  //   socket.emit('failed to join room');
  //   console.log(err);
  // }
}

createRoom('test room');

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
      joinRoom(roomName, socket);
    } else {
      socket.emit('invalid room');
    }
  });

  socket.on('join public room', function(){
    var roomName = 'test room';
    joinRoom(roomName, socket);
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
