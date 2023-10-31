import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid';
function Image() {
  const [err, setErr] = useState(false)

  async function checkDigit(img) {
    console.log("img")
    console.log(img)

    let formData = new FormData()
    formData.append('file', img)

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }


    try {
      console.log(formData.keys)
      const response = await axios.post(process.env.REACT_APP_API_URL + "/image/upload", formData, config);
      console.log(response)
    } catch (err) {
      console.log(err)
    }

  }

  function imageProcessing(e) {
    e.preventDefault()
    if (e.target.files !== undefined) {
      if (e.target.files.length > 0) {
        const img = document.createElement('img');

        const selectedImage = e.target.files[0];
        console.log(selectedImage)
        const objectURL = URL.createObjectURL(selectedImage);

        const form = new FormData();
        form.append("file", img);

        checkDigit(selectedImage)

        img.onload = function handleLoad() {
          console.log(`Width: ${img.width}, Height: ${img.height}`);
          console.log(img)
          console.log(objectURL)
          if (img.width == 28 && img.height == 28) {
            //checkDigit(selectedImage)    
          }

          URL.revokeObjectURL(objectURL);
        };
        img.src = objectURL;
      }
    }
  }



  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '50vh' }}
        >
          <Grid item xs={3}>
            <Container maxWidth="xs">
              <input
                id="image-input"
                type="file"
                accept="image/*"
                multiple
                onChange={imageProcessing}
              />


            </Container>
          </Grid>
        </Grid>


      </React.Fragment>

    </div>
  );
}

export default Image;