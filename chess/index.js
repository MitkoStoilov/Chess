var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var cors = require('cors');
var session = require('express-session');
var passport = require('passport');

var s = require('./modules/server.js');
var play = require('./modules/play-game.js');

var config = require('./config/database');

var logoutRouter = require('./routes/logout');
var indexRouter = require('./routes/index');
var gameRouter = require('./routes/game');
var queryRouter = require('./routes/query');
var userRouter = require('./routes/users');
var profileRouter = require('./routes/profile');
var oldGamesRouter = require('./routes/old');

const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/profile');
const bcrypt = require('bcryptjs');


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


s.app.use(passport.initialize());
s.app.use(passport.session());
require('./config/passport')(passport);


s.app.use('/', indexRouter);
s.app.use('/logout', logoutRouter);
s.app.use('/game', gameRouter);
s.app.use('/query', queryRouter.router);
s.app.use('/users', userRouter);
s.app.use('/profile', profileRouter);
s.app.use('/old', oldGamesRouter);

play.playGame();

s.server.listen(process.env.PORT || 3000);
console.log('Server running on port 3000...');

module.exports = s.app;
