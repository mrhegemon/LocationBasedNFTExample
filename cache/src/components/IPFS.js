import { create, globSource } from 'ipfs-core';

let IPFS;

export const uploadCacheToIPFS = async ({ location, thumbnail, media, metadata }) => {
  if(!IPFS) {   
    IPFS = await startIPFS()
  }
  const [thumbnailCID, mediaCID] = await Promise.all([ addToIPFS(thumbnail), addToIPFS(media) ]);
  const CID = await addToIPFS(JSON.stringify({ location, metadata, thumbnailUrl: thumbnailCID, dataUrl: mediaCID }));
  return CID;
}


export const initMinter = async (secret) => {
  await startIPFS()
}

export const stopMinter = async () => {
  await IPFS.stop()
}

export const startIPFS = async () => {
  if(!IPFS) IPFS = await create();
}

export const addToIPFS = async (dataToUpload, metadata) => {

  console.log('uploading', dataToUpload, 'to ipfs')
  const file = {
    content: dataToUpload,
    path: metadata ? 'metadata.json' : undefined
  };

  const addOptions = {
    pin: true,
    timeout: 300000
  };

  const result = await IPFS.add(file, addOptions);
  return result.cid.toString();
}
