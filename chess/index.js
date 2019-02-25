var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.get('/', function(req, res){
  res.send("Hello there!");
});

server.listen(3000, function(){
  console.log("listening on port 3000...");
});
