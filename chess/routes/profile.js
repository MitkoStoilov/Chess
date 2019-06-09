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
  res.json({file: req.file});
});


router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
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
});

router.delete('/image/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
  });
});


router.get('/',function(req,res){
  User.findOne({email: req.session.email}, function(err, user){
    if(err){
      throw err;
    }
    res.render('profile', {layout: false});

  });
});



router.get('/status', function(req, res){
  User.findOne({email: req.session.email}, function(err, user){
    if(err){
      throw err;
    }
    var status = { user: user.name,
                   victories: user.victories,
                   losses: user.losses,
                   profileImage: user.profileImage
                   }
    res.json(status);
  });
});

module.exports = router;
