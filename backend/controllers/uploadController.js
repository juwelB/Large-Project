const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
console.log('Upload directory:', uploadDir); // Debug log

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  console.log('Creating upload directory'); // Debug log
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Multer destination:', uploadDir); // Debug log
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + path.extname(file.originalname);
    console.log('Generated filename:', filename); // Debug log
    cb(null, filename)
  }
});

const upload = multer({ storage: storage }).single('logo');

const uploadFile = (req, res) => {
  console.log('uploadFile function called');
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err); // Debug log
      return res.status(500).json(err)
    } else if (err) {
      console.error('Unknown error:', err); // Debug log
      return res.status(500).json(err)
    }
    if (!req.file) {
      console.log('No file uploaded'); // Debug log
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('File uploaded:', req.file); // Debug log
    const filePath = `/uploads/${req.file.filename}`;
    console.log('File path:', filePath); // Debug log
    return res.status(200).json({ filePath: filePath });
  })
};

module.exports = {
  uploadFile
};