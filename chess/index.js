var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var cors = require('cors');
var session = require('express-session');

var mongoose = require('mongoose');
const database = 'chess';

class Database {
  constructor() {
    this._connect()
  }
_connect() {
     mongoose.connect(`mongodb://localhost/${database}`, {useNewUrlParser: true})
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
module.exports = new Database()

let GameModel = require('./models/game.js');

/*let roomex = new GameModel({ //Saving new documents to the DB
  roomno:3,
  player1:'tsenko',
  player2:'proba',
  gamestate:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
})
roomex.save()
   .then(doc => {
     console.log(doc)
   })
   .catch(err => {
     console.error(err)
   })
*/


var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

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

var connections = [];
var roomno=1;
var player;
server.listen(process.env.PORT || 3000);
console.log('Server running on port 3000...');

app.get('/', function(req, res){
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
        console.log(results);
        res.redirect('/game/?roomno='+results[0].roomno);
      }
    });
  }else {
    res.render('login.ejs', {layout:false});
  }


});

app.post('/login',function(req, res){
	req.session.email = req.body.email;
	res.end('done');
});

app.get('/game/', function(req, res){
  res.render('about',{
    user: req.session.email
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

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('connectToRoom', function(data){
    socket.join("room-"+data);
    var index=data;
    GameModel.findOne({roomno: index}, function(err, results){
      var fen = results.gamestate;
      io.sockets.in("room-"+data).emit('load', {
        fen: fen
      });
    });
  });

  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected %s sockets connected', connections.length);
  });

  socket.on('make a move', function(data){
    var index=data.num;
    GameModel.findOne({roomno: index}, function(err, results){
      results.gamestate = data.fen;
      results.save();
      io.sockets.in("room-"+data.num).emit('new move', data.fen);
    });
  });
});
