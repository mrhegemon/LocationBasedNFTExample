import React, { Fragment, useEffect, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = ({ uploadedFile }) => {
  // TODO: 
  // 1. Add video preview, re-record and submit buttons
  // 2. On cancel, hide view
  // 3. On submit upload and show progress
  // 4. When file is uploaded, show file uploaded view

  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  useEffect(() => {
    (async function () {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        const res = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );

            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);
          }
        });

        const { nftResponse } = res.data;
        console.log(nftResponse)

      } catch (err) {
        if (err.response.status === 500) {
          setMessage('There was a problem with the server');
        } else {
          setMessage(err.response.data.msg);
        }
      }
    })();
  });

  return (
    <div id="overlay">
      {message ? <Message msg={message} /> : null}
      <form>

        <Progress percentage={uploadPercentage} />

      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FileUpload;