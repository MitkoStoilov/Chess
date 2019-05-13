const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

var User = require('../models/profile');

router.get('/register', function(req, res){
  res.render('register');
});


router.post('/register', function(req, res){
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const password2 = req.body.password2;

/*  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);*/

//  var errors = req.validationErrors();

  /*if(errors){
    res.render('register',{
      errors:erros
    });
  } else {*/
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
          newUser.save(function(err){
            if(err){
              console.log(err);
              return;
            } else {
              res.redirect('/');
            }
          });
        });
    });
  //}
});

module.exports = router;
