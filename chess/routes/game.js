var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

const model = require('../models/game.js');
const GameModel = model.GameModel;
const User = require('../models/profile');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

router.get('/:white/:black', function(req, res){
  res.render('about',{
    user: req.session.email,
    white: req.params.white,
    black: req.params.black
  });
});
var count = 0;
router.post('/:white/:black', function(req, res){
  count++;
  var game
  var winner = req.body.winner;
  console.log(winner);
  User.findOne({email: req.session.email}, function(err, user){
    if(user.email == winner){
      user.victories++;
    } else {
      user.losses++;
    }
    user.save();
  });

  GameModel.findOne({roomno: req.body.roomno}, function(err, result){
    if(result){
      User.findOne({email: req.session.email}, function(err, user){
        //console.log(user.games[0].player1);
        user.games.player1 = result.player1;
        user.games.player2 = result.player2;
        user.games.moves = result.moves;
        user.save();
      });
    }
  });
  if(count % 2 == 0){
    GameModel.findOneAndRemove({roomno: req.body.roomno}, function(err, result){
        if (err) throw err;
    });
  }
  res.end('done');

});

module.exports = router;
