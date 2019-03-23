var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var cors = require('cors');
var session = require('express-session');
var mongoose = require('mongoose');


var app = express();
var server = require('http').createServer(app);

/*var Game = require('./models/game');

mongoose.connect('mongodb://localhost/chess');
var db = mongoose.connection;

db.once('open', function(){
  console.log('Conected to mongodb...');
})*/

app.use(session({secret: 'awesome'}));

app.use(bodyParser());
app.use(cors());
app.use(expressLayouts);
app.use(express.static(__dirname + '/views'));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

users = [];
connections = [];
var oponent;
var games = [
  {
    id: 1,
    gamefen: "test",
    player1: "mitko",
    player2: "pesho"
  }
];

app.get('/', function(req, res){

  if(req.session.email) {
    for(var i = 0; i < games.length;i++){
      if(req.session.email===games[i].player1){
        res.redirect('/about');
        oponent = games[i].player2
      } else if(req.session.email===games[i].player2){
        res.redirect('/about');
        oponent = games[i].player1
      } else {
        res.render('index',{
          games: games
        });
      }
    }
  } else {
    res.render('login.ejs', {layout:false});
  }
});

app.post('/login',function(req, res){
	req.session.email = req.body.email;
//	req.session.password = req.body.pass;
	res.end('done');
});

app.get('/about', function(req, res){
  res.render('about',{
    oponent: oponent
  });
});

app.get('/logout',function(req,res){

	req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

server.listen(process.env.PORT || 3000);
console.log('Server running on port 3000...');
