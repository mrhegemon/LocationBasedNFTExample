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
      environment={{
          preset: 'contact',
          seed: 2,
          lightPosition: { x: 0.0, y: 0.03, z: -0.5 },
          fog: 0.8,
          ground: 'none',
          groundYScale: 6.31,
          groundTexture: 'walkernoise',
          groundColor: '#8a7f8a',
          grid: 'none'
        }}
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
