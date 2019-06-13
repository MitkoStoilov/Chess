var express = require('express');
var router = express.Router();
const User = require('../models/profile');
const PlayedGame = require('../models/playedGame.js');

router.get('/games',function(req,res){
  PlayedGame.findOne({player1: req.session.username}, function(err, game){
    res.render('played_game', {
      moves: game.moves,
      player1: game.player1,
      player2: game.player2
    });
  });

});


router.get('/all/games',function(req,res){
  var page = req.query.page;

  if (page === undefined) {
    page = 1;
  }
  console.log(req.session.username);
	PlayedGame.paginate( { $or:[  { player1: req.session.username },  { player2: req.session.username} ]}, {page:page, limit:1},(error, result) => {
	  if (error) {
		  console.error(error);
			return null;
		}
		console.log(result);
		if (result != null) {
		  res.json({games: result});
		} else {
			res.json({});
	  }
	});
});

router.get('/all',function(req,res){
  res.render('all_games',{layout: false,
                          username: req.session.username});
});

module.exports = router;
