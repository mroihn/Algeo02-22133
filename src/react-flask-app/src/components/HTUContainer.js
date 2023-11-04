import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function HTUContainer() {
  return (
    <Card>
      <Card.Header as="h5">Featured</Card.Header>
      <Card.Body>
        <Card.Title>Xandey</Card.Title>
        <Card.Text>
          Untuk lebih lengkapnya link di bawah ini.
        </Card.Text>
        <Button variant="primary" href="https://github.com/mroihn/Algeo02-22133">Go to Github</Button>
      </Card.Body>
    </Card>
  );
}

export default HTUContainer;