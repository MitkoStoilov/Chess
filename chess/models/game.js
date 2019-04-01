var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let gameSchema = new Schema({
  roomno:{
    type: Number,
    required: true,
    unique: true
    
  },
  player1:{
    type: String,
    required: true,
    unique: true
    
  },
  player2:{
    type: String,
    required: true,
    unique: true
  },
  gamestate:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Game', gameSchema);

/*var Game = mongoose.model('Game', gameSchema);
module.exports = {GameModel : Game, connection : mongoose.connection};*/

