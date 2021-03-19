import FileUpload from "./FileUpload.js"
import Nav from "./Nav.js"
import { Entity, Scene } from 'aframe-react';
function App() {
  // THREEx.ArToolkitContext.baseURL = 'https://raw.githack.com/jeromeetienne/ar.js/master/three.js/'

  return (
    <div className="App">
      <Nav />
      <FileUpload />
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
    </div>
  );
}

export default App;
