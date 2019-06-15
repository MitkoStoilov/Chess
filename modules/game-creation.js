const model = require('../models/game.js');
const GameModel = model.GameModel;

exports.create = function (req, res) {
  var roomex = new GameModel({
    roomno:req.body.roomno,
    player1:req.body.player1,
    player2:req.body.player2,
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
