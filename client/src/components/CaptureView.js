import React, { Fragment } from 'react';
import VideoRecorder from 'react-video-recorder'
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

const CaptureView = (props) => {
  const { callback } = props;
  // TODO: 
  // 1. Add fullscreen div, camera preview, close and record button
  // 2. On close, hide view
  // 3. On finished recording, go to preview/upload
  // 4. Flip camera!

  return (
    <div className="overlay">
    <IconButton size="large" onClick={() => { console.log("Return callback is", callback); callback(false) }} style={{position:"fixed", zIndex:"10000", width:"3em", height:"3em", right: "3em", top:"3em"}}>
      <CloseIcon fontSize="large"/>
    </IconButton>
    <VideoRecorder
      onRecordingComplete={videoBlob => {
        callback(true, videoBlob);
        console.log('Video recording complete', videoBlob);
      }}
    />
    </div>
  );
};

export default CaptureView;