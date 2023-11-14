import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container } from 'react-bootstrap';

// Import background image
import backgroundImage from '../img/bg.jpg';

function LPContainer() {
  const handleButtonClick = () => {
    window.location.href = '/image-retrieval';
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={containerStyle}>
      <Container fluid className="text-white text-center py-5">
        <h1 className="display-4">Xandey</h1> 
        <p className="lead">Elevate your image search experience, try our web today and witness the power of visual discovery at your command</p> 
        <Button variant="outline-light" onClick={handleButtonClick}>
          Get Started
        </Button>
      </Container>
    </div>
  );
}

export default LPContainer;
