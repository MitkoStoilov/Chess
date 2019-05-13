var express = require('express');
var router = express.Router();
const User = require('../models/profile');

router.get('/',function(req,res){
  User.findOne({email: req.session.email}, function(err, user){
    res.render('profile', {
      wins: user.victories,
      losses: user.losses,
      name: user.name
    });

  });
});

module.exports = router;
