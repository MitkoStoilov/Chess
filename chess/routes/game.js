var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('about',{
    user: req.session.email
  });
});

module.exports = router;
