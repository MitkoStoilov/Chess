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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(expressLayouts);
app.use(express.static(__dirname + '/views'));

app.use('/css', express.static('css'));
app.use('/img', express.static('img'));
app.use('/js', express.static('js'));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

users = [];
connections = [];

var games = [
  {
    roomno: 1,
    gamestate: "test",
    player1: "mitko",
    player2: "pesho"
  },
  {
    roomno: 2,
    gamestate: "test",
    player1: "tisho",
    player2: "misho"
  }
];

app.get('/', function(req, res){
  var ingame = false;
  if(req.session.email) {
    for(var i = 0; i < games.length; i++){
      if(req.session.email===games[i].player1){
        res.redirect('/game/?roomno='+games[i].roomno);
        ingame = true;
      } else if(req.session.email===games[i].player2){
        res.redirect('/game/?roomno='+games[i].roomno);
        ingame = true;
      }
    }
    if(ingame === false){
      res.render('index',{
        games: games,
        users: users
      });
    }
  } else {
    res.render('login.ejs', {layout:false});
  }
});

app.post('/login',function(req, res){
	req.session.email = req.body.email;
//	req.session.password = req.body.pass;
  users.push(req.session.email);
	res.end('done');
});

app.get('/game/', function(req, res){
  res.render('about');
});


///////////////////testing
app.get('/test', function(req, res){

  res.sendFile(__dirname + '/test.html');

});
/////////////////////////////

app.get('/logout',function(req,res){
  users.splice(users.indexOf(req.session.email), 1);
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
