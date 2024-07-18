const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'images');
console.log('Upload directory:', uploadDir); // Debug log

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  console.log('Creating upload directory'); // Debug log
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadFile = (req, res) => {
  console.log('uploadFile function called');
  const file = req.files.logo;
  const filename = Date.now() + path.extname(file.name);
  const filePath = path.join(uploadDir, filename);

  file.mv(filePath, (err) => {
    if (err) {
      console.error('Error saving file:', err); // Debug log
      return res.status(500).json({ message: 'Error saving file' });
    }
    console.log('File uploaded:', filePath); // Debug log
    return res.status(200).json({ filePath: `/images/${filename}` });
  });
};

module.exports = {
  uploadFile
};