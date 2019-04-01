var s = require('./server.js');
var io = require('socket.io').listen(s.server);

const model = require('../models/game.js');
const GameModel = model.GameModel;

exports.playGame = function(){
  var connections = [];
  var roomno=1;
  io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('connectToRoom', function(data){
      socket.join("room-"+data);
      var index=data;
      GameModel.findOne({roomno: index}, function(err, results){
        var fen = results.gamestate;
        io.sockets.in("room-"+data).emit('load', {
          fen: fen
        });
      });
    });

    socket.on('make a move', function(data){
      var index=data.num;
      GameModel.findOne({roomno: index}, function(err, results){
        results.gamestate = data.fen;
        results.save();
        io.sockets.in("room-"+data.num).emit('new move', data.fen);
      });
    });

    socket.on('disconnect', function(data){
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected %s sockets connected', connections.length);
    });
  });
}
