import Card from 'react-bootstrap/Card';

function AboutContainer() {
  return (
    <Card>
      <Card.Header>About Us</Card.Header>
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p>
            {' '}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            posuere erat a ante.{' '}
          </p>
          <footer className="blockquote-footer">
            Xandey
          </footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutContainer;