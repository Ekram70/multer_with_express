const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
app.use(cors());

const PORT = 3000;
const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, Date.now() + '-' + fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

app.post('/api/', upload.single('image'), (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  profileImg = url + '/' + req.file.filename;
  res.send(profileImg);
});

app.listen(PORT, () => console.log(`server is listening at port ${PORT}`));
