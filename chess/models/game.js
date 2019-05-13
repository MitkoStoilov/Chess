var mongoose = require('mongoose');
const database = 'chess';

var Schema = mongoose.Schema;

class Database {
  constructor() {
    this._connect()
  }
_connect() {
     mongoose.connect(`mongodb://localhost/${database}`, {useNewUrlParser: true})
       .then(() => {
         console.log('Database connection from game.js successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
module.exports = new Database()

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
  },

  moves:{
    type: String
  },
  
  winner:{
    type: String
  }
});

//module.exports = mongoose.model('Game', gameSchema);

var Game = mongoose.model('Game', gameSchema);
module.exports = {GameModel : Game, connection : mongoose.connection, gameSchema: gameSchema};
