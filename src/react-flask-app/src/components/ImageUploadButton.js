import React, { useState, useRef,useCallback, useEffect } from 'react';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import NoImage from '../img/no_image.jpg';
import Webcam from 'react-webcam';

export let imageQuery 

function ImageUploadButton() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);
  const [isSearchMode, setSearchMode] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const webcamRef = React.useRef(null);

  const handleToggle = () => {
    setSearchMode(!isSearchMode);
    sendDataToAPI(!isSearchMode ? 'color' : 'texture');
  };

  const sendDataToAPI = (data) => {
    // Kirim data ke API flask untuk menentukan search mode
    fetch('http://localhost:5000/api/searchmode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleImageUpload = () => {
    handleFileChange();
  };

  const handleFileChange = () => {
    // Ambil data image dari API
    fetch('http://localhost:5000/api/upload', {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch image');
        }
      })
      .then((data) => {
        setSelectedImage(data.image.image_url);
        setSelectedFileName(data.image.image_name);
        imageQuery = data.image.image_name;
        console.log(data);
      })
      .catch((error) => {
        console.error('Error during image fetch:', error);
      });
  };

  // Handler untuk ambil foto
  const handleCapture = useCallback(() => {
    setCameraOn(true);
    setRemainingTime(5);

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      const delayedImageSrc = webcamRef.current.getScreenshot();
      setCameraOn(false);
      setRemainingTime(0);

      // Send the image to the Flask server
      const formData = new FormData();
      formData.append('file', dataURItoBlob(delayedImageSrc), 'captured_photo.jpg');

      fetch('http://localhost:5000/api/camera', {
        method: 'POST',
        body: formData,
      })

      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to capture image');
        }
      })
      .then((data) => {
        setSelectedImage(data.image.image_url);
        setSelectedFileName(data.image.image_name);
        imageQuery = data.image.image_name;
        console.log(data);
      })
      .catch((error) => {
        console.error('Error during image fetch:', error);
      });

    }, 5000);
  }, [webcamRef]);

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainingTime]);

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  return (
    <div className="container mt-4">
      <Container style={{ maxWidth: '500px' }}>
        <Row>
          <Col sm={6} className="mb-3">
            <div className="justify-content-between">
             <Row className="mt-3">
                <label htmlFor="image-upload">
                  <Button variant="primary" onClick={handleToggle}>
                    {isSearchMode ? 'Color' : 'Texture'}
                  </Button>
                </label>
              </Row>
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <Row className="mt-3">
                <label htmlFor="image-upload">
                  <Button variant="primary" onClick={handleImageUpload}>
                    Insert Image
                  </Button>
                </label>
              </Row>
              <Row className="mt-3">
                <label htmlFor="image-upload">
                  <Button variant="info" onClick={handleCapture} disabled={cameraOn}>
                    Capture Image
                  </Button>
                </label>
              </Row>
            </div>
          </Col>
          <Col sm={6}>
            {selectedImage ? (
              <div>
                <Card style={{ width: '250px' }}>
                  <Card.Img
                    src={`http://localhost:5000/api/image/${selectedFileName}`}
                    alt="Selected"
                    className="img-fluid"
                    rounded="true"
                  />
                </Card>
                <p>{selectedFileName}</p>
              </div>
            ) : (
              <div>
              <Card style={{ width: '250px' }}>
                <Card.Img
                  src={NoImage}
                  alt="Selected"
                  className="img-fluid"
                  rounded="true"
                />
              </Card>
              <p>{selectedFileName}</p>
            </div>
            )}
            {cameraOn && (
              <div>
                <Card style={{ width: '250px' }}>
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
                </Card>
                <p>Remaining Time: {remainingTime} seconds</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ImageUploadButton;
