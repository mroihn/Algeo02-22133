import React, { useState, useRef } from 'react';
import { Card, Col, Container, Row, Button } from 'react-bootstrap';
import Image from '../img/no_image.jpg';

function Result() {
  const [images, setImages] = useState(Array(12).fill(Image));
  const fileInputRef = useRef(null);
  const [page, setPage] = useState(1);

  const handleUploadDataset = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const fileInput = event.target;
    const uploadedImages = [];
  
    if (fileInput.files && fileInput.files.length > 0) {
      for (let i = 0; i < Math.min(fileInput.files.length); i++) {
        const file = fileInput.files[i];
        const imageUrl = URL.createObjectURL(file);
        uploadedImages.push(imageUrl);
      }
    }
  
    // Send the array of images to the Flask backend
    fetch('http://localhost:5000/api/uploaddataset', {
      method: 'POST',
      body: JSON.stringify({ images: uploadedImages }), // Send the array of images as JSON
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from Flask
        console.log('Response from Flask:', data);
  
        // Update the images in the state with the response from Flask
        if (data.images) {
          setImages(data.images);
        }
      })
      .catch((error) => {
        // Handle errors if any
        console.error('Error:', error);
      });
  };
  

  // Menghitung batas bawah dan atas gambar yang akan ditampilkan berdasarkan halaman
  const itemsPerPage = 12;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage; // Mengganti images.length
  const displayedImages = images.slice(startIndex, endIndex);

  return (
    <Container>
      <Row className="mb-3">
        {displayedImages.map((image, index) => (
          <Col sm={3} key={index}>
            <Card style={{ width: '300px' }}>
              <Card.Img src={image} alt={`Image ${index + 1}`} className="img-fluid" />
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col className="d-flex justify-content-start">
          <div>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
              onChange={handleFileChange}
            />
            <Button variant="primary" onClick={handleUploadDataset} className="mb-3">
              Upload Dataset
            </Button>
          </div>
        </Col>
        <Col className="d-flex justify-content-end">
          <div>
            <Button
              variant="primary"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>{' '}
            <Button
              variant="primary"
              onClick={() => setPage(page + 1)}
              disabled={endIndex >= images.length}
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Result;