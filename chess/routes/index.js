var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const database = 'chess';

const model = require('../models/game.js');
const GameModel = model.GameModel;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


router.get('/', function(req, res){
  var ingame = false;
  if(req.session.email) {
    GameModel.find({player1: req.session.email}, function(err, results){
      if (err) throw err;
      if (!results.length) {
        GameModel.find({player2: req.session.email}, function(err, results){
          if (err) throw err;
          if (!results.length) {
            console.log("Nothing");
            res.render('index');
          } else {
            console.log(results);
            res.redirect('/game/?roomno='+results[0].roomno);
          }
        });
      } else {
        //console.log(results);
        res.redirect('/game/?roomno='+results[0].roomno);
      }
    });
  }else {
    res.render('login.ejs', {layout:false});
  }
});

router.post('/login',function(req, res){
	req.session.email = req.body.email;
	res.end('done');
});

module.exports = router;
