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
var maxPlayerCount = 100;
var redTeamName = "Republican";
var blueTeamName = "Democrat";
var independentTeamName = "Swing Voter";
var hackerTeamName = "Russian";

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
                    independentTeam:[],
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

function prepGame(roomName) {
  var room = rooms[roomName];
  var roomPlayers = Object.keys(room.players);
  if (roomPlayers.length >= minPlayerCount && roomPlayers.length <= maxPlayerCount) {
    var hacker = roomPlayers.splice(Math.floor(Math.random()*roomPlayers.length), 1);
    room.hackerTeam = [hacker];

    if (roomPlayers.length % 2 == 1) {
      var independent = roomPlayers.splice(Math.floor(Math.random()*roomPlayers.length), 1);
      room.independentTeam =  [independent];
    }

    var remainingPlayers = roomPlayers.length;

    for (var i=0; i < remainingPlayers/2; i++) {
      var redPlayer = roomPlayers.splice(Math.floor(Math.random()*roomPlayers.length), 1);
      var redTeam = room.redTeam;
      redTeam.push(redPlayer);
      room.redTeam = redTeam;
    }

    room.blueTeam = roomPlayers;

    rooms[roomName] = room;

  } else {
    console.log('not enough players to start game');
  }
}

function startGame(roomName){
  try {
    room = rooms[roomName];
    for (var i = 0; i < room.redTeam.length; i ++) {
      io.to(room.redTeam[i]).emit('starting game', redTeamName);
    }
    for (var i = 0; i < room.blueTeam.length; i ++) {
      io.to(room.blueTeam[i]).emit('starting game', blueTeamName);
    }
    for (var i = 0; i < room.independentTeam.length; i ++) {
      io.to(room.independentTeam[i]).emit('starting game', independentTeamName);
    }
    for (var i = 0; i < room.hackerTeam.length; i ++) {
      io.to(room.hackerTeam[i]).emit('starting game', hackerTeamName);
    }
    room.state = roomStates.announceCandidates;
    rooms[roomName] = room;
  } catch (err) {
    console.log(err);
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
  if (rooms[roomName]!=undefined && rooms[roomName].state == roomStates.lobby) {
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
  try {
    addPlayerToRoom(roomName, socket);
    var playerNicks = Object.keys(rooms[roomName].players).map(function(key) {
        return rooms[roomName].players[key];
    });
    socket.emit('successfully joined room', {roomName:roomName, players:playerNicks});
    socket.broadcast.to(roomName).emit('new player joined room', playerNicks);
    if (playerNicks.length >=  minPlayerCount) {
      io.to(roomName).emit('enough players');
      console.log('enough players in room ' + roomName);
    }
    console.log(socket.nickname + " joined room " + roomName);
  } catch (err) {
    throw(err);
  }
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

  socket.on('join room', function(msg, callback){
    var roomName = msg.trim().toLowerCase();
    try {
      if (roomName.length == 4) {
        joinRoom(roomName, socket);
        callback({success:true});
      } else {
        callback({error:'invalid room'});
      }
    } catch (err) {
      callback({error:err});
    }
  });

  socket.on('join public room', function(callback){
    var roomName = 'test room';
    try {
      joinRoom(roomName, socket);
      callback({success:true});
    } catch(err) {
      callback({error:err});
    }
  });

  socket.on('start game countdown', function(msg) {
    console.log('start game received for ' + msg);
    if (msg in rooms && socket.id in rooms[msg].players) {
      console.log('prep game');
      prepGame(msg);
      console.log('start game');
      startGame(msg);
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
