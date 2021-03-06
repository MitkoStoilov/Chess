const mongoose = require('mongoose');
const database = 'chess';


var Schema = mongoose.Schema;

class Database {
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

module.exports = new Database()


let userSchema = new Schema({

    email:{
        type:String,
        required:true,
        unique:true
    },

    name:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true,
        unique:true
    },

    victories:{
        type:Number,
        default: 0
    },

    profileImage:{
      type:String,
      required: false
    },

    losses:{
        type:Number,
        default: 0
    },

    draws:{
      type:Number,
      default: 0
    },

    elo:{
        type:Number,
        default: 0
    }
});

var User = mongoose.model('User', userSchema);
module.exports = User;
