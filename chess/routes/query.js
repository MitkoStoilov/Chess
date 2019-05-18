var express = require('express');
var router = express.Router();
var name;
router.get('/', function(req, res){
  res.render('query', {
    name: req.session.email
  });
});

router.post('/',function(req, res){

	res.end('done');
});

module.exports ={ router: router};
