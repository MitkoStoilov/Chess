var express = require('express');
var router = express.Router();
const User = require('../models/profile');
var name;

router.get('/', function(req, res){

  res.render('query', {
    name: req.session.username
  });
});

router.post('/',function(req, res){

	res.end('done');
});

module.exports ={ router: router};
