var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var cors = require('cors');
var session = require('express-session');

var mongoose = require('mongoose');
const database = 'chess';

const model = require('./models/game.js');
const GameModel = model.GameModel;

var logoutRouter = require('./routes/logout');
var indexRouter = require('./routes/index');
var gameRouter = require('./routes/game');


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

/*
let roomex = new GameModel({ //Saving new documents to the DB
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

app.use('/', indexRouter);
app.use('/logout', logoutRouter);
app.use('/game/', gameRouter);

//var play = require('./modules/play-game.js');
//play.playGame();

server.listen(process.env.PORT || 3000);
console.log('Server running on port 3000...');


var connections = [];
var roomno=1;
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

  socket.on('make a move', function(data){
    var index=data.num;
    GameModel.findOne({roomno: index}, function(err, results){
      results.gamestate = data.fen;
      results.save();
      io.sockets.in("room-"+data.num).emit('new move', data.fen);
    });
  });

  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected %s sockets connected', connections.length);
  });
});

module.exports = app;
