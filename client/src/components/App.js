import { Entity, Scene } from 'aframe-react';
import { useState } from 'react';
import { IconButton } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import FileUpload from "./FileUpload.js"
import CaptureView from "./CaptureView.js"
import FileUploadComplete from "./CaptureView.js"
import Nav from "./Nav.js"
import Splash from "./Splash.js"

import { ViewModes } from "../constants/ViewModes"

function App() {
  // THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'
  const [viewMode, setViewMode] = useState(ViewModes.ARView);

  return (
    <div className="App">
      <Nav />
      <Scene
        environment={{ preset: "forest" }}
        vr-mode-ui='enabled: false'
        arjs='sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false;'>
          <Entity
            primitive="a-camera"
            gps-camera
            rotation-reader
          />
        </Scene>
        { viewMode === ViewModes.ARView && 

        <IconButton size="large"  onClick={() => { setViewMode(ViewModes.CaptureView)}} style={{position:"absolute", width:"3em", height:"3em", marginLeft: "50%", marginRight: "50%", bottom:"3em"}}>
          <PhotoCamera fontSize="large"/>
        </IconButton>
        }
        { viewMode === ViewModes.Splash && 
          <Splash />
        }
        { viewMode === ViewModes.CaptureView && 
          <CaptureView />
        }
      { viewMode === ViewModes.PreviewUploadView && 
        <FileUpload />
      }
      { viewMode === ViewModes.UploadedView && 
        <FileUploadComplete />
      }

    </div>
  );
}

export default App;
