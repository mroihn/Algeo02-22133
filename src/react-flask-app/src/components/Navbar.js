import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Logo from '../img/Xandey.gif';

function Navbars() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">
            <Image
              src={Logo} 
              alt="Xandey Logo" 
              height="30"  
              className="d-inline-block align-top"  
            />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="image-retrieval">Image Retrieval</Nav.Link>
            <Nav.Link href="how-to-use">How To Use</Nav.Link>
            <Nav.Link href="about">About Us</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbars;