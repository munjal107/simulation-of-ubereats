const multer = require('multer')
var path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/')
  },
  filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
})

module.exports.upload = upload

// app.use('../../uploads', express.static(path.join(__dirname, '/uploads')));
// upload.single('profilePicUrl'),