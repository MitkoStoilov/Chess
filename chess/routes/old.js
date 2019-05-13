var express = require('express');
var router = express.Router();
const User = require('../models/profile');

router.get('/games',function(req,res){
  User.findOne({email: req.session.email}, function(err, user){
    res.render('played_game', {
      moves: user.games.moves,
      player1: user.games.player1,
      player2: user.games.player2
    });

  });
});

module.exports = router;
