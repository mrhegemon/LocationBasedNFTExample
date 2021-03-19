const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
var cors = require('cors')
app.use(cors({ origin: "*"}))
app.use(fileUpload());
app.use(express.static('public'))

// Upload Endpoint
app.post('/upload', (req, res) => {
    console.log("Received upload request")
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.listen(5000, () => console.log('Server Started...'));