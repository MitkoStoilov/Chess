const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const passport = require('passport');


var User = require('../models/profile');

router.get('/register', function(req, res){
  res.render('register');
});


router.post('/register', function(req, res){
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    console.log("error");
    res.render('register',{
      errors:errors
    });
  } else {
    var newUser = new User({
      email:email,
      name:name,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newUser.password = hash;
          newUser.victories = 0;
          newUser.losses = 0;
          newUser.save(function(err){
            if(err){
              console.log(err);
              return;
            } else {
              res.setHeader("Location", "localhost:3000/users/login");
              res.status(201);
              //res.json(newUser);
              res.end();
              //res.redirect('/users/login');

            }
          });
        });
    });
  }
});

router.get('/login', function(req, res){
  res.render('login.ejs', {layout:true});
});

router.post('/login',function(req,res,next){
  console.log(req.body.username);
  if(req.body.username==undefined){
    res.status(404);
    res.end();
  }else{
    User.findOne({email: req.body.username}, function(err, user){
      if(err){
        throw err;
      }
      req.session.email = user.email;
      req.session.username = user.name;
    });

    next();
  }

}, passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login'
}));

module.exports = router;
