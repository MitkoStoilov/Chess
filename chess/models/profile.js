const mongoose = require('mongoose');
const database = 'chess';

var Schema = mongoose.Schema;

/*class Database {
    constructor() {
      this._connect()
    }
  _connect() {
       mongoose.connect(`mongodb://localhost/${database}`, {useNewUrlParser: true})
         .then(() => {
           console.log('Database connection from profile.js successful')
         })
         .catch(err => {
           console.error('Database connection error')
         })
    }
  }
  module.exports = new Database()class Database {
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
*/

let profileSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    /*password:{
        type:String,
        required:true,
        unique:true
    }*/
    //Do we need pass for now?

    victories:{
        type:Number
    },

    losses:{
        type:Number
    },

    elo:{
        type:Number
    }

});

var Profile = mongoose.model('Profile', gameSchema);
module.exports = {ProfileModel : Profile, connection : mongoose.connection, t :'hi'};