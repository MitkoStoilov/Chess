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
  User.findOne({name: req.session.username}, function(err, result){
    var player = result;
    PlayedGame.paginate( { $or:[  { player1: player._id },  { player2: player._id} ]}, {page:page, limit:1},(error, result) => {
  	  if (error) {
  		  console.error(error);
  			return null;
  		}
  		console.log(result.docs[0].player1);

  		if (result != null) {
        var game = result;
        User.findOne({_id: game.docs[0].player1}, function(err, player1){
          if (err) throw err;
          if(player1 == null){
            game.docs[0].player1 = "fallen warrior"
          }else{
            game.docs[0].player1 = player1.name;
          }
          User.findOne({_id: game.docs[0].player2}, function(err, player2){
            if (err) throw err;
            if(player2 == null){
              game.docs[0].player2 = "fallen warrior"
            }else{
              game.docs[0].player2 = player2.name;
            }
            //game.docs[0].player2 = player2.name;
            console.log(game);
            res.json({games: game});
          });
        });
  		} else {
  			res.json({});
  	  }
  	});
  });


});

router.get('/all',function(req,res){
  res.render('all_games',{layout: false,
                          username: req.session.username});
});

module.exports = router;
