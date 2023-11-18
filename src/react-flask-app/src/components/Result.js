import React, { useState, useRef } from 'react';
import { Card, Col, Container, Row, Button, Form } from 'react-bootstrap';
import NoImage from '../img/no_image.jpg';
import LoadingGif from '../img/loading.gif'
import './loading.css';

function Result() {
  const [images, setImages] = useState(Array(12).fill(null));
  const fileInputRef = useRef(null);
  const elapsedTimeRef = useRef(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scrap, setScrap] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');

  //Handler ketika tombol search diklik
  const handleSearch = () => {
    setLoading(true);
    const startTime = performance.now(); 
    fetch('http://localhost:5000/api/imagerecognition', {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch dataset');
        }
      })
      .then((data) => {
        const endTime = performance.now(); 
        elapsedTimeRef.current = (endTime - startTime) / 1000;
        console.log('Time taken for image recognition (s):', elapsedTimeRef.current);
        
        console.log('Response:', data);
        setImages(data.similar_images || []);
      })
      .catch((error) => {
        alert("Anda belum memasukkan file atau dataset");
        console.error('Error during dataset fetch:', error);
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  const handleUploadDataset = () => {
    // Trigger handleFileChange 
    handleFileChange();
  };

  // Handler untuk mendapatkan dataset
  const handleFileChange = () => {
    fetch('http://localhost:5000/api/uploaddataset', {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch dataset');
        }
      })
      .then((data) => {
        console.log(data);
        setImages(data.images || []);
      })
      .catch((error) => {
        console.error('Error during dataset fetch:', error);
      });
  };

  const handleImageScraping = () => {
    setScrap('on');
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const uploadedUrl = websiteUrl;
    console.log('Uploaded URL:', uploadedUrl);

    // Reset form and hide it
    setWebsiteUrl('');
    setScrap(false);

    setLoading(true);

    fetch('http://localhost:5000/api/imagescraping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: uploadedUrl }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch image scraping');
        }
      })
      .then((data) => {
        console.log(data);
        setImages(data.images || []);
      })
      .catch((error) => {
        console.error('Error during image scraping fetch:', error);
      })
      .finally(() => {
        setLoading(false); 
      });

  };

  // Menghitung batas bawah dan atas gambar yang akan ditampilkan berdasarkan halaman
  const itemsPerPage = 12;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedImages = images.slice(startIndex, endIndex);

  return (
    <Container>
      <Row>
        <Col>
          <Button variant="primary" onClick={handleSearch} className="mt-3">
            Search
          </Button>
          {loading && (
            <div className="loading-container">
              <img src={LoadingGif} alt="Loading" className="loading-gif" />
            </div>
          )}
        </Col>
      </Row>
      {elapsedTimeRef.current ? (
        <Row>
          <Col>
            <p>Total Result: {images.length}</p>
          </Col>
          <Col>
            <p>Time Taken : {elapsedTimeRef.current} s</p>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <p>You haven't performed a data search yet</p>
          </Col>
        </Row>
      )}
      <Row className="mb-3">
        {displayedImages.map((image, index) => (
          <Col sm={3} key={index}>
            <Card style={{ width: '300px' }}>
              {image ? (
                <>
                  <Card.Img src={`http://localhost:5000/api/images/${image.image_url}`} alt={`Image ${index + 1}`} className="img-fluid" />
                  {image.similarity && (
                    <Card.Body>
                      <Card.Title>Similarity: {image.similarity} %</Card.Title>
                    </Card.Body>
                  )}
                </>
              ) : (
                <>
                  <Card.Img src = {NoImage}/>
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col className="d-flex justify-content-start">
          <div>
            <input
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
      <Row>
        <Col className="d-flex justify-content-start">
          <div>
            <input
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
            />
            <Button variant="primary" onClick={handleImageScraping} className="mb-3">
              Image Scrapping
            </Button>
          </div>
        </Col>
      </Row>
      {scrap && (
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Website url</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              Contoh : 'https://www.contoh.com'
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </Container>
  );
}

export default Result;

