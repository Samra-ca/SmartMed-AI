const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const valid = allowed.test(file.originalname.toLowerCase());
    valid ? cb(null, true) : cb(new Error('Only images allowed'));
  }
});

module.exports = upload;