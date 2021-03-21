import { Entity, Scene } from 'aframe-react';
import { useState, useCallback, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import axios from 'axios';

import FileUpload from "./FileUpload.js"
import CaptureView from "./CaptureView.js"
import Nav from "./Nav.js"
import Splash from "./Splash.js"

import Web3 from 'web3'
import Cache from '../abis/Cache.json'

import { ViewModes } from "../constants/ViewModes"

function App() {
  // THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'
  const [viewMode, setViewMode] = useState(ViewModes.ARView);
  const [latLong, setLatLong] = useState(null);
  const [caches, setCaches] = useState([]);
  const [video, setVideo] = useState(null);

  const [ canUseLocation, setCanUseLocation] = useState(true);
  const [ state, setState ] = useState ({
    account: '',
    contract: null,
    totalSupply: 0,
    caches: []
  })

  useEffect(() => {
    (async function(){

    await loadWeb3()
    await loadBlockchainData()
  })();

  });

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockchainData = async() => {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    setState({ ...state, account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Cache.networks[networkId]
    if(networkData) {
      const abi = Cache.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      setState({ ...state, contract })
      const totalSupply = await contract.methods.totalSupply().call()
      setState({ ...state, totalSupply })
      // Load Caches
      for (var i = 1; i <= totalSupply; i++) {
        const cache = await contract.methods.caches(i - 1).call()
      setState({
        ...state,
          caches: [...state.caches, cache]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  const mint = (cache) => {
    state.contract.methods.mint(cache).send({ from: thistate.account })
    .once('receipt', (receipt) => {
      setState({
        ...state,
        caches: [...state.caches, cache]
      })
    })
  }
  var markerModel = {
        url: './assets/Marker.glb',
        scale: '0.6 0.6 0.6',
        info: ''
    }


  useEffect(() => {
    renderPlaces(caches);
  }, [caches])

  useEffect(() => {
    renderPlaces(caches);
  }, [caches])

  function renderPlaces(places) {
    console.log("Rendering places");
    console.log(places);
    let scene = document.querySelector('a-scene');

    places?.forEach(async (place) => {

        let metadata = await(await fetch('https://ipfs.io/ipfs/' + place)).json()
        console.log(metadata)
        
        let latitude = metadata.location.lat;
        let longitude = metadata.location.lng;
        console.log("latitude is", latitude);
        console.log("longitude is", longitude);

        const thumbnailUrl = metadata.thumbnailUrl;

        console.log("Got thumbnail", thumbnailUrl);

        // TODO: Apply thumbnail as image to marker material

        let model = document.createElement('a-entity');

          console.log("Model ID isn't set");
          model.setAttribute('id', thumbnailUrl);
          model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
          model.setAttribute("look-at", "[gps-camera]");
          model.setAttribute('rotation', '0 0 0');
          model.setAttribute('animation-mixer', '');
          
          model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
          });

          model.setAttribute('scale', markerModel.scale);
          model.setAttribute('gltf-model', markerModel.url);

          scene.appendChild(model);
    });
  }
  
  const handleFileUploadCallback = (status) => {
    console.log("File uploaded and returning, status is", status);
    getCaches(() => {
      setViewMode(ViewModes.ARView);
    })
  }

  const getCaches = (callback) => {
    console.log("Getting caches")
    const max = 50;
    axios.get(`${location.origin}/api/get?lat=${latLong.lat}&lng=${latLong.lng}&max=${max}`)
  .then(function (response) {
    // handle successee
    console.log(response);
    setCaches(response.data);
    renderPlaces(caches);
    if(callback) callback();
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  }
  
  useEffect(() => {
    if(!latLong){
    if (navigator.geolocation) {
      setCanUseLocation(true);
      navigator.geolocation.getCurrentPosition((position) =>
      setLatLong ({lat: position.coords.latitude, lng: position.coords.longitude}));
    } else {
      setCanUseLocation(false);
    }
  return;
  }

  getCaches();

  }, [latLong])

  const handleVideoCallback = useCallback((success, payload) => {
    if(success){
      setVideo(payload);
      setViewMode(ViewModes.UploadView);
      console.log("Video captured successfully");
    } else {
      setViewMode(ViewModes.ARView);
      console.log("Video capture cancelled");
    }
  }, []);

  return (
    <div className="App">
      <Nav />
      <a-scene

      // environment={{ preset: "forest" }}
      vr-mode-ui='enabled: false'
      arjs='sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: true;'>
        <a-camera
          gps-camera="minDistance: 0; maxDistance: 10000000000000000"
          rotation-reader
        />

      </a-scene>
      
        { viewMode === ViewModes.ARView && 
        <IconButton onClick={() => { setViewMode(ViewModes.CaptureView)}} style={{position:"absolute", width:"3em", height:"3em", marginLeft: "50%", marginRight: "50%", bottom:"3em"}}>
          <PhotoCamera />
        </IconButton>
        }
        { viewMode === ViewModes.Splash && 
          <Splash />
        }
        { viewMode === ViewModes.CaptureView && 
          <CaptureView callback={handleVideoCallback} />
        }
      { viewMode === ViewModes.UploadView && 
        <FileUpload upload={video} latLong={latLong} callback={handleFileUploadCallback}/>
      }

      { state.caches.map((cache, key) => {
        return(
          <div key={key} className="col-md-3 mb-3">
            <div>{cache}</div>
          </div>
        )
      })}
    </div>
  );
}

export default App;
