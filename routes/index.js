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
    res.render('index', {layout: false, username: req.session.username});
  }else {
    res.redirect('/users/register');
  }
});

module.exports = router;
