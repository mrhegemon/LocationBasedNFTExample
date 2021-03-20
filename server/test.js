require('dotenv').config();
const nft = require('./src/NFT');

nft.initMinter(process.env.SECRET).then(async () => {
  const randomLocation = () => { return { lat: (Math.random()*180)-90, lat: (Math.random()*360)-180 }; }
  let time = Date.now();
  await nft.mintNFT(randomLocation(), "Hello, NFT!")
  console.log(Date.now() - time);
  time = Date.now();
  await nft.mintNFT(randomLocation(), "This is a test...")
  console.log(Date.now() - time);
  time = Date.now();
  await nft.mintNFT(randomLocation(), "Let's hope it passes!")
  console.log(Date.now() - time);
  time = Date.now();
  await nft.mintNFT(randomLocation(), "One of these won't be retrieved as we've only asked for 3!")
  console.log(Date.now() - time);
  time = Date.now();
  console.log(await nft.getNFT(randomLocation(), 3))
})