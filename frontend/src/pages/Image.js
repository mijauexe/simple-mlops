import axios from "axios";
import React, { useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';

function Image() {
  const [err, setErr] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const [mlResult, setMlResult] = useState(undefined)

  async function checkDigit(img) {
    let formData = new FormData()
    formData.append('file', img)

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/image/upload", formData, config);
      setMlResult(response.data.digit)
    } catch (err) {
      setErr(true)
      setErrMsg(err.response.data.message)
    }

  }

  function imageProcessing(e) {
    e.preventDefault()
    
    setErr(false)
    setErrMsg("")
    setMlResult(undefined)

    if (e.target.files !== undefined) {
      if (e.target.files.length > 0) {
        if (e.target.files[0].type.startsWith('image/')) {
          const img = document.createElement('img');

          const selectedImage = e.target.files[0];
          const objectURL = URL.createObjectURL(selectedImage);
  
          const form = new FormData();
          form.append("file", img);
  
  
          img.onload = function handleLoad() {
            if (img.width === 28 && img.height === 28) {
              checkDigit(selectedImage) 
            } else {
              setErr(true)
              setErrMsg("Image is not from MNIST dataset, try again.")
            }
  
            URL.revokeObjectURL(objectURL);
          };
          img.src = objectURL;
        } else {
          setErr(true)
          setErrMsg("You haven't uploaded a photo, try again.")
        }
        
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
      {err && <Alert severity="error">{errMsg}</Alert>}
      {mlResult && <Alert severity="success">The model says this image is a: {mlResult}</Alert>}
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
              
              

        <Button component="label" variant="contained" color = "secondary" startIcon={<CloudUploadIcon />}>
          Upload image
          <VisuallyHiddenInput type="file"  accept="image/*" onChange={imageProcessing}/>
        </Button>


            </Container>
          </Grid>
        </Grid>


      </React.Fragment>

    </div>
  );
}

export default Image;