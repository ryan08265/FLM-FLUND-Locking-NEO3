import React, {useState} from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { lockingData } from "./data.js";

const Locking = () => {
    const [FLMAmount, setFLMAmount] = useState(0);
    const [FUSDTAward, setFUSDTAward] = useState(0);
    const [lockingPeriod, setLockingPeriod] = useState(0);

    return (
      <div className = 'lockingwrapper'>
        <div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Deposit FLM Amount</InputGroup.Text>
            <Form.Control
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={FLMAmount}
              onChange={(e) => setFLMAmount(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Award FUSDT Amount</InputGroup.Text>
            <Form.Control
              placeholder="Username"
              aria-label="Username"rnotepad
              aria-describedby="basic-addon1"
              value={FUSDTAward}
              onChange={(e) => setFUSDTAward(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Locking Period</InputGroup.Text>
            <Form.Control
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={lockingPeriod}
              onChange={(e) => setLockingPeriod(e.target.value)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Recipient's username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
          </InputGroup>a

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