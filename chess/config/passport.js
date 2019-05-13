const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/profile');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  console.log("Here");
  //console.log(passport);
  passport.use(new LocalStrategy(function(email, password, done){
    var query = {email:email};

    User.findOne(query, function(err, user){
      if(err) {
        console.log(err);
      }

      if(!user){

        return done(null, false, {message: 'Wrong email/password'});
      }

      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }else {
          return done(null, false, {message: 'Wrong email/password'});
        }
      });

    });
  }));

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });
}
