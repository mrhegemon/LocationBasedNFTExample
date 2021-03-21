const { create, globSource } = require('ipfs-core');
let ipfs;

export const uploadCacheToIPFS = async ({ location, thumbnail, media, metadata }) => {
  if(!ipfs) {
    ipfs = await startIPFS()
  }
  const locationObj = JSON.parse(location);
  const [thumbnailCID, mediaCID] = await Promise.all([ addToIPFS(thumbnail), addToIPFS(media) ]);
  const CID = await addToIPFS(JSON.stringify({ location: locationObj, metadata, thumbnailUrl: thumbnailCID, dataUrl: mediaCID }));
  return CID;
}


const addToIPFS = async (dataToUpload) => {

  console.log('uploading', dataToUpload, 'to ipfs')
  const file = {
    content: dataToUpload
  };

  const addOptions = {
    pin: true,
    timeout: 300000
  };

  const result = await IPFS.add(file, addOptions);
  return result.cid.toString();
}