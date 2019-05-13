var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const database = 'chess';

const model = require('../models/game.js');
const GameModel = model.GameModel;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


router.get('/',function(req, res){
  var ingame = false;
  if(req.session.email) {
    GameModel.find({player1: req.session.email}, function(err, results){
      if (err) throw err;
      if (!results.length) {
        GameModel.find({player2: req.session.email}, function(err, results){
          if (err) throw err;
          if (!results.length) {
            //console.log("Nothing");
            res.render('index');
          } else {
            //console.log(results);
            res.redirect('/game/'+results[0].player1+'/'+results[0].player2+'/?roomno='+results[0].roomno);
          }
        });
      } else {
        //console.log(results);
        res.redirect('/game/'+results[0].player1+'/'+results[0].player2+'/?roomno='+results[0].roomno);
      }
    });
  }else {
    res.redirect('/users/register');
  }
  //res.render('index');
});



module.exports = router;
