import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { lockingData } from "./data.js";

neolineN3.pickAddress()
.then(result => {
    const { label, address } = result;
    console.log('label:' + label);
    console.log('address' + address);
})
.catch((error) => {
    const {type, description, data} = error;
    switch(type) {
        case 'NO_PROVIDER':
            console.log('No provider available.');
            break;
        case 'CANCELED':
            console.log('The user cancels, or refuses the dapps request');
            break;
        default:
            // Not an expected error object.  Just write the error to the console.
            console.error(error);
            break;
    }
});

const Locking = () => {
    return (
      <div className = 'lockingwrapper'>
        <Row xs={1} md={3} className="g-4">
          {lockingData.map((data, idx) => (
            <Col>
              <Card
                bg="primary"
                text="white"
                className="mb-2"
              >
              <Card.Header>Locking Pool {idx + 1}</Card.Header>
                <Card.Body>
                  <Card.Text>FLMAmount : {data.FLMAmount}</Card.Text>
                  <Card.Text>FUSDTAward : {data.FUSDTAward}</Card.Text>
                  <Card.Text>LockingStartTime : {data.lockingStatingTime}</Card.Text>
                  <Card.Text>LockingFinishTime : {data.lockingFinishTime}</Card.Text>
                  <Button variant="danger">Show more</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            <Form.Control
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Recipient's username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
          </InputGroup>

          <Form.Label htmlFor="basic-url">Your vanity URL</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon3">
              https://example.com/users/
            </InputGroup.Text>
            <Form.Control id="basic-url" aria-describedby="basic-addon3" />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control aria-label="Amount (to the nearest dollar)" />
            <InputGroup.Text>.00</InputGroup.Text>
          </InputGroup>

          <InputGroup>
            <InputGroup.Text>With textarea</InputGroup.Text>
            <Form.Control as="textarea" aria-label="With textarea" />
          </InputGroup>
        </div>
      </div>
      
    );
}
  
export default Locking;