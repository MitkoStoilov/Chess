const mongoose = require('mongoose');
const database = 'chess';

console.log("test");
var Schema = mongoose.Schema;

class Database {
    constructor() {
      this._connect()
    }
  _connect() {
       mongoose.connect(`mongodb://localhost/${database}`, {useNewUrlParser: true})
         .then(() => {
           console.log('Database connection from playedGame.js successful')
         })
         .catch(err => {
           console.error('Database connection error')
         })
    }
  }

let PlayedGameSchema = new Schema({
    gameNumber:{
      type: Number
    },
    player1: {
      type:String
    },
    player2: {
      type:String
    },
    moves: {
      type:String
    }
});

var PlayedGame = mongoose.model('PlayedGame', PlayedGameSchema);
module.exports = PlayedGame;
