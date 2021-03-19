const express = require('express');
const fileUpload = require('express-fileupload');
const { initMinter, stopMinter, mintNFT, getNFT } = require('./src/NFT');
require('dotenv').config();

initMinter(process.env.SECRET).then(() => {

  const app = express();
  var cors = require('cors')
  app.use(cors({ origin: "*"}))
  app.use(fileUpload());
  app.use(express.static('public'))

  // Upload Endpoint
  app.post('/upload', (req, res) => {
    
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;

    file.mv(`${__dirname}/public/uploads/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      const nftResponse = await mintNFT(file.name)
      if(!nftResponse) {
        return res.status(500).json({ msg: 'Failed to mint token, try again soon.' });
      }

      res.json({ nftResponse });
    });
  });

  app.listen(5000, () => console.log('Server Started...'));

})