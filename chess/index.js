var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var cors = require('cors');
var session = require('express-session');
var mongoose = require('mongoose');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

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

var roomno=1;

server.listen(process.env.PORT || 3000);
console.log('Server running on port 3000...');

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


io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);


  if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
  socket.join("room-"+roomno);

  io.sockets.in("room-"+roomno).emit('connectToRoom', roomno);


  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected %s sockets connected', connections.length);
  });

  socket.on('make a move', function(data){
    io.sockets.in("room-"+data.num).emit('new move', data.fen);
  });
});
