var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

const model = require('../models/game.js');
const GameModel = model.GameModel;
const User = require('../models/profile');
const PlayedGame = require('../models/playedGame.js');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

router.get('/:white/:black', function(req, res){
  res.render('about',{
    user: req.session.username,
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
    if(user.name == winner){
      user.victories++;
    } else {
      user.losses++;
    }
    user.save();
  });

  res.end('done');

});

router.post('/save', function(req, res){
  PlayedGame.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, game) {
    var newGame = new PlayedGame({
      player1: req.body.player1,
      player2: req.body.player2,
      moves: req.body.moves
    });
    newGame.save(function(err){
        if(err){
          console.log(err);
          return;
        }
    });
    GameModel.findOneAndRemove({roomno: req.body.roomno}, function(err, result){
        if (err) throw err;
    });
  });
});

module.exports = router;