var express = require('express');
var router = express.Router();
const User = require('../models/profile');
var name;

router.get('/', function(req, res){
  if(req.session.email){
    res.render('query', { layout: false,
      name: req.session.username
    });
  }else{
    res.redirect('/users/login');
  }
});

router.post('/',function(req, res){

	res.end('done');
});

module.exports ={ router: router};
