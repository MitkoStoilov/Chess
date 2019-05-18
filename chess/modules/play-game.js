var s = require('./server.js');
var io = require('socket.io').listen(s.server);

const model = require('../models/game.js');
const GameModel = model.GameModel;

exports.playGame = function(){
  var waiting = [];
  var name;
  var connections = [];
  var roomno=1;
  io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('wait', function(data){
      name = data.name;
      if(waiting.indexOf(name) == -1){
        waiting.push(name);
        console.log(waiting.length);
      }
      if(waiting.length >= 2){
        //Saving new game to the DB
        let roomex = new GameModel({
          roomno:roomno,
          player1:waiting[0],
          player2:waiting[1],
          gamestate:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          moves:""
        });
        roomex.save()
           .then(doc => {
             console.log(doc)
           })
           .catch(err => {
             console.error(err)
           });

        io.sockets.emit('startGame', {
          player1: waiting[0],
          player2: waiting[1],
          roomno: roomno
        });

        roomno++;
        waiting.shift();
        waiting.shift();
      }
    });

    socket.on('connectToRoom', function(data){
      socket.join("room-"+data);
      var index=data;
      GameModel.findOne({roomno: index}, function(err, results){
        var fen = results.gamestate;
        var player1 = results.player1;
        var moves = results.moves;
        io.sockets.in("room-"+data).emit('load', {
          fen: fen,
          player1: player1,
          moves: moves
        });
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
      if(waiting.indexOf(name) != -1){
        waiting.splice(waiting.indexOf(name), 1);
        console.log(waiting.length);
      }
      console.log('Disconnected %s sockets connected', connections.length);
    });
  });
}
