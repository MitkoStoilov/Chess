var express = require('express');
var router = express.Router();

router.get('/:white/:black', function(req, res){
  res.render('about',{
    user: req.session.email,
    white: req.params.white,
    black: req.params.black
  });
});

module.exports = router;
