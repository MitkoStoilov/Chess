const model = require('../models/game.js');
const GameModel = model.GameModel;

exports.createGame = function (player1, player2, roomNumber) {
  var roomex = new GameModel({
    roomno:roomNumber,
    player1:player1,
    player2:player2,
    gamestate:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves:""
  });
  roomex.save()
     .then(doc => {
       console.log(doc);
     })
     .catch(err => {
       console.error(err);
     });

};
