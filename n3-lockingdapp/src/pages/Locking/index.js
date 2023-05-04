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
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Set Locking Period</InputGroup.Text>
            <Form.Control
              placeholder="Recipient's username"
              aria-label="Recipient's username with two button addons"
              value={lockingPeriod}
              onChange={(e) => setLockingPeriod(e.target.value)}
            />
            <Button variant="outline-secondary">Begin New Locking</Button>
          </InputGroup>
        </div>
      </div>
      
    );
}
  
export default Locking;