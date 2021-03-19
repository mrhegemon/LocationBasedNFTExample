const express = require('express');
const fileUpload = require('express-fileupload');
const querystring = require('querystring');
const url = require('url');
var uuidv4 = require('uuid/v4');

const { initMinter, stopMinter, mintNFT, getNFT } = require('./src/NFT');

require('dotenv').config();

if(!process.env.SECRET) throw new Error('No treasury wallet supplied, aborting...');

initMinter(process.env.SECRET).then(() => {

  const app = express();
  var cors = require('cors')
  app.use(cors({ origin: "*"}))
  app.use(fileUpload());
  app.use(express.static('public'))

  const mockNFTS = {
      tokens: [
          {
              name: "DTLA_1", // Marker is irrelevant
              location:{
                  lat: 34.0407,
                  long: 118.2468
              }
          },
          {
            name: "DTLA_2", // Marker is irrelevant
            location:{
                lat: 34.0417,
                long: 118.2478
            }
        },
        {
            name: "DTLA_3", // Marker is irrelevant
            location:{
                lat: 34.039,
                long: 118.2458
            }
        }
      ]
  }

  app.get('/get', (req, res) => {

    let parsedUrl = url.parse(req.url);
    let { lat, lng, max } = querystring.parse(parsedUrl.query);
    console.log("Received get request with lat long max", lat, lng, max);
    return res.status(200).send(JSON.stringify(mockNFTS));
  })


  // Upload Endpoint
  app.post('/upload', (req, res) => {
    console.log("Upload file request received");
    if (req.files === null) {
      console.log("No file uploaded");

      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;
    const fileName =  uuidv4() + '.webm';
    file.name = fileName

    file.mv(`${__dirname}/public/uploads/${fileName}`, async err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      const nftResponse = await mintNFT(fileName);
      console.log("**** NFT MINTED");
      if(!nftResponse) {
        return res.status(500).json({ msg: 'Failed to mint token, try again soon.' });
      }
      console.log(nftResponse);
      res.json({ nftResponse });
    });
  });

  app.listen(5000, () => console.log('Server Started...'));

})