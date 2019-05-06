var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var cors = require('cors');
var session = require('express-session');

var s = require('./modules/server.js');
var play = require('./modules/play-game.js');

var logoutRouter = require('./routes/logout');
var indexRouter = require('./routes/index');
var gameRouter = require('./routes/game');
var queryRouter = require('./routes/query');

s.app.use(session({secret: 'awesome'}));
s.app.use(bodyParser.json());
s.app.use(bodyParser.urlencoded({extended: true}));
s.app.use(cors());
s.app.use(expressLayouts);
s.app.use(express.static(__dirname + '/views'));

s.app.use('/css', express.static('css'));
s.app.use('/img', express.static('img'));
s.app.use('/js', express.static('js'));

s.app.set('views', path.join(__dirname, 'views'));
s.app.set('view engine', 'ejs');

s.app.use('/', indexRouter);
s.app.use('/logout', logoutRouter);
s.app.use('/game', gameRouter);
s.app.use('/query', queryRouter.router);

play.playGame();

s.server.listen(process.env.PORT || 3000);
console.log('Server running on port 3000...');

module.exports = s.app;
