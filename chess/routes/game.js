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

router.post('/:white/:black', function(req, res){
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

  GameModel.findOneAndRemove({roomno: req.body.roomno}, function(err, result){});


  res.end('done');

});

module.exports = router;
