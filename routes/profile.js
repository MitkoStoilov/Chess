var express = require('express');
var router = express.Router();
const User = require('../models/profile');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


router.use(bodyParser.json());
router.use(methodOverride('_method'));


const mongoPath = 'mongodb://localhost/chess';
const conn = mongoose.createConnection(mongoPath);

let gfs;

conn.once('open', () =>{
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: mongoPath,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

router.post('/upload',upload.single('file'),  (req, res) =>{
  User.findOne({email: req.session.email}, function(err, user){
    if(err){
      throw err;
    }
    user.profileImage = req.file.filename;
    user.save();
  });
  res.json({file: req.file});
});


router.get('/image/:username', (req, res) => {
  if(req.session.email){
    User.findOne({name: req.params.username}, function(err, user){
      if(user.profileImage == null){
        return res.status(404).json({ err: err });
      }else{
        gfs.files.findOne({ filename: user.profileImage }, (err, file) => {
          if (!file || file.length === 0) {
            return res.status(404).json({
              err: 'No file exists'
            });
          }

          if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {

            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
          } else {
            res.status(404).json({
              err: 'Not an image'
            });
          }
        });
      }
    });
  }else{
    res.redirect('/users/login');
  }
});

router.delete('/image/delete', (req, res) => {
  console.log("test1");
  User.findOne({email: req.session.email}, function(err, user){
    if (err) {
      return res.status(404).json({ err: err });
    }

    gfs.files.findOne({ filename: user.profileImage }, (err, file) => {
      if (err) {
        return res.status(404).json({ err: err });
      }

      user.profileImage = "";
      user.save();
      console.log("test2");
      gfs.remove({ _id: file.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
        console.log("test3");
        res.redirect('/');
      });
    });
  });
});


router.get('/',function(req,res){
  if(req.session.email){
    User.findOne({email: req.session.email}, function(err, user){
      if(err){
        throw err;
      }
      res.render('profile', {layout: false});

    });
  } else {
    res.redirect('/users/login');
  }
});



router.get('/status', function(req, res){
  if(req.session.email){
    User.findOne({email: req.session.email}, function(err, user){
      if(err){
        throw err;
      }

      var status = { user: user.name,
                     victories: user.victories,
                     losses: user.losses,
                     draws: user.draws,
                     password: user.password,
                     profileImage: user.profileImage
                     }
      console.log(status);
      res.json(status);
    });
  }else{
    res.status(401);
    res.end();
  }
});

router.put('/update/:username', function(req, res){
  if(req.session.email){
    console.log(req.params.username);
    User.findOne({email: req.session.email}, function(err, user){
      if(err){
        throw err;
      }
      user.name = req.params.username;
      user.save();
      res.end();
    });
  }else{
    res.status(401);
    res.end();
  }
});


router.delete('/delete', function(req, res){
  if(req.session.email){
    User.findOneAndRemove({email: req.session.email}, function(err, user){
      if(err){
        throw err;
      }
      req.session.destroy(function(err) {
        if(err) {
          console.log(err);
        } else {
          res.end("done");
        }
      });
    });
  }else{
    res.status(401);
    res.end();
  }
});


module.exports = router;
