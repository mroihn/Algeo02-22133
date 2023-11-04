import React, { useState, useRef } from 'react';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';

function ImageUploadButton() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setSelectedFileName(file.name); // Setel nama file yang dipilih

    // Kirim gambar ke server Flask
    const formData = new FormData();
    formData.append('image', file);

    fetch('http://localhost:5000/api/upload', { // Sesuaikan dengan host dan port Flask Anda
    method: 'POST',
    body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      // Handle respons dari server Flask (jika diperlukan)
      console.log('Response from Flask:', data);
      console.log('Uploaded filename:', data.filename); // Mengakses nama file dari respons
    })
    .catch((error) => {
      // Handle kesalahan jika ada
      console.error('Error:', error);
    });
  
    
  };

  return (
    <div className="container mt-4">
      <Container style={{ maxWidth: '500px' }}>
        <Row>
          <Col sm={6}>
            <div className="d-flex justify-content-between">
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <label htmlFor="image-upload">
                <Button variant="primary" onClick={handleImageUpload}>
                  Insert Image
                </Button>
              </label>
            </div>
          </Col>
          <Col sm={6}>
            {selectedImage && (
              <div>
                <Card style={{ width: '250px' }}>
                  <Card.Img
                    src={selectedImage}
                    alt="Selected"
                    className="img-fluid"
                    rounded="true"
                  />
                </Card>
                <p>{selectedFileName}</p> {/* Menampilkan nama file di sini */}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ImageUploadButton;
