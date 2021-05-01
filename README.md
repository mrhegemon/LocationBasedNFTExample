# Location Based NFT Example
This was a submission for a hackathon project. We decided to leave it up in case any wandering travelers researching location-based NFTs came along. NFTs are minted on the Rinkeby test network and stored along with their location on the chain using a custom contract. Other users can load NFTs from the contract and view them at their stored location.

One of the limitations with this idea currently is that Metamask and other wallet-browsers do not provide Location services, so you can't get fine location easily. If you built your own app with your own Web3 injection you could get around this, but adoption in that case would be difficult.

```
Capture moments that matter and leave them in the world to be discovered. Share a moment in the footsteps of another. Lifecache is a new kind of social app. Utilizing location, augmented reality and blockchain to build a completely public, permanent record of our best moments and favorite places.

Lifecache. Because you were here.
```
Design: https://www.figma.com/file/F8SmDYbGxcp8VQnoNNFFNO/Lifecache?node-id=0%3A1

ens: lifecache.eth (needs to be repointed to latest IPFS build)

demo: https://xrnft.vercel.app/

Packages used:

- IPFS
- AR.js
- A-Frame
- Next.js

Minted on the matic chain. Everything aside from script imports and NPM packages was written for the EthGlobal NFT Hack.
