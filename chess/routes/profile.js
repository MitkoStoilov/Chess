var express = require('express');
var router = express.Router();
const User = require('../models/profile');

router.get('/',function(req,res){
  User.findOne({email: req.session.email}, function(err, user){
    if(err){
      throw err;
    }
    res.render('profile', {layout: false});

  });
});

router.get('/status', function(req, res){
  User.findOne({email: req.session.email}, function(err, user){
    if(err){
      throw err;
    }
    var status = { user: user.name,
                   victories: user.victories,
                   losses: user.losses }
    res.json(status);
  });
});

module.exports = router;
