var mongoose = require('mongoose');

let gameSchema = mongoose.Schema({
  roomno:{
    type: Number,
    required: true
  },
  player1:{
    type: Srting,
    required: true
  },
  player2:{
    type: Srting,
    required: true
  }
});

var Game = module.exports = mongoose.model('Game', gameSchema);
