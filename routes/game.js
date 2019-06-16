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
  if(req.session.email){
    var player1 = req.params.white;
    var player2 = req.params.black;
    GameModel.findOne({player1: player1, player2: player2, roomno: req.query.roomno}, function(err, result){
        if (err){
          throw err;
        }else {
          if(result == null){
            res.status(404);
            res.end("No such game");
          }else {
            res.render('about',{ layout: false,
              user: req.session.username,
              white: player1,
              black: player2
            });
            res.status(200);
            res.end();
          }
        }
    });
  } else {
    res.end("pls login or register");
  }
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
  })
  res.setHeader("Location", "localhost:3000/old/all/games");
  res.status(201);
  res.end("done")
});

router.delete('/:white/:black/:roomno', function(req, res){
  console.log("deleted game in roomno: " + req.params.roomno);
  if(req.session.username == req.params.white){
    GameModel.findOneAndRemove({roomno: req.params.roomno}, function(err, result){
        if (err){
          throw err;
        }else{
          res.status(200);
          res.end();
        }
    });
  }
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
