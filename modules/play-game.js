var s = require('./server.js');
var io = require('socket.io').listen(s.server);
const model = require('../models/game.js');
const GameModel = model.GameModel;
var create = require('./game-creation.js');

var lobby = require('./join-lobby.js');

exports.playGame = function(){
  var waiting = [];
  var onlineUsers = [];
  var connections = [];
  var roomno=1;
  io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('join lobby', function(data){
      lobby.joinLobby(socket, onlineUsers, data.name);
      updateUsers();
    });

    socket.on('request', function(data){
      io.sockets.emit('responce', data);
    });

    socket.on('wait', function(data){
      onlineUsers.splice(onlineUsers.indexOf(socket.username), 1);
      console.log("online:" + onlineUsers.length);
      if(waiting.indexOf(socket.username) == -1){
        waiting.push(socket.username);
        console.log("waiting:" + waiting.length);
        updateUsers();
      }
      if(waiting.length >= 2){

        var players = {player1: waiting[0], player2: waiting[1]};
        waiting.shift();
        waiting.shift();
        gameMaker(players, roomno);
        roomno++;

      }
    });

    socket.on('challenge', function(data){
      onlineUsers.splice(onlineUsers.indexOf(socket.username), 1);
      onlineUsers.splice(onlineUsers.indexOf(data), 1);
      console.log("online:" + onlineUsers.length);

      var players = {player1: socket.username, player2: data};
      gameMaker(players, roomno);
      roomno++;

    });

    socket.on('connectToRoom', function(data){
      socket.join("room-"+data);
      var index=data;
      GameModel.findOne({roomno: index}, function(err, results){
        if(results==null){

        }else{
          var fen = results.gamestate;
          var player1 = results.player1;
          var moves = results.moves;
          io.sockets.in("room-"+data).emit('load', {
            fen: fen,
            player1: player1,
            moves: moves
          });
        }
      });
    });

    socket.on('make a move', function(data){
      var index=data.num;
      GameModel.findOne({roomno: index}, function(err, results){
        results.gamestate = data.fen;
        results.moves += data.move.from +'-'+data.move.to+"; ";
        var moves = results.moves;
        results.save();

        io.sockets.in("room-"+data.num).emit('new move', {fen:data.fen, move:data.move, moves: moves});
      });
    });

    socket.on('disconnect', function(data){
      connections.splice(connections.indexOf(socket), 1);
      if(waiting.indexOf(socket.username) != -1){
        waiting.splice(waiting.indexOf(socket.username), 1);
        console.log("waiting:" + waiting.length);
      }
      if(onlineUsers.indexOf(socket.username) != -1){
        onlineUsers.splice(onlineUsers.indexOf(socket.username), 1);
        console.log("online:" + onlineUsers.length);
      }
      console.log('Disconnected %s sockets connected', connections.length);
      updateUsers();
    });

    function updateUsers(){
      io.sockets.emit('get users', onlineUsers);
    }

    function startGame(player1, player2, roomno){
      io.sockets.emit('startGame', {
        player1: player1,
        player2: player2,
        roomno: roomno
      });
    }

    function gameMaker(players, roomno){
      create.createGame(players.player1, players.player2, roomno);
      startGame(players.player1, players.player2, roomno);
      updateUsers();
      //roomno++;
      return roomno;
    }
  });
}
