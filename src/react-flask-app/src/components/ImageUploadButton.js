import React, { useState, useRef } from 'react';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import NoImage from '../img/no_image.jpg';

function ImageUploadButton() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);
  const [isSearchMode, setSearchMode] = useState(true);
  const [loading, setLoading] = useState(false);

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
        console.log(data);
      })
      .catch((error) => {
        console.error('Error during image fetch:', error);
      });
  };

  // Handler untuk ambil foto
  const handleCaptureImage = () => {
    setLoading(true); 
    fetch('http://localhost:5000/api/capture_image', {
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
        console.log(data);
      })
      .catch((error) => {
        console.error('Error during image fetch:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
                  <Button variant="info" onClick={handleCaptureImage}>
                    Capture Image
                  </Button>
                </label>
                {loading && <span className="ml-2">Loading...</span>}
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
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ImageUploadButton;
