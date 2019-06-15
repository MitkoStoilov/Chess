var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

const model = require('../models/game.js');
const GameModel = model.GameModel;
const User = require('../models/profile');
const PlayedGame = require('../models/playedGame.js');
var create = require('../modules/game-creation.js');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

router.get('/:white/:black', function(req, res){
  res.render('about',{ layout: false,
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
  var looser = req.body.looser;
  console.log(winner);
  User.findOne({email: req.session.email}, function(err, user){
    if(user.name == winner){
      user.victories++;
    } else if(user.name == looser){
      user.losses++;
    }else{
      user.draws++;
    }
    user.save();
  });

  res.end('done');

});

router.post('/save', function(req, res){
  console.log(req.body.roomno);
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

router.post('/create', function(req, res){
  if(req.session.username == req.body.player1){
    create.create(req, res);
    res.setHeader("Location", "localhost:3000/game/" + req.body.player1 + "/"
      + req.body.player2 + "/?roomno=" + req.body.roomno);
    res.status(201);
    res.end("done");
  }else{
    res.end("done");
  }
});

module.exports = router;
