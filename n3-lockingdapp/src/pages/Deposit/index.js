import React, {useState} from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

import { lockingData } from "./data.js";
const Deposit = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [info, setInfo] = useState([]);
  const handleShowMore = (data) => {
    setInfo(data)
    setShow(true);
  }
  const handleDeposit = (e) => {
    e.preventDefault();
  }
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
                  <Card.Text>LockingPeriod : {data.lockingPeriod}</Card.Text>
                  <Button variant="danger" onClick={() => handleShowMore(data)}>Lock funds!</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Locking Pool Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card.Body>
              <Card.Text>FLMAmount : {info.FLMAmount}</Card.Text>
              <Card.Text>FUSDTAward : {info.FUSDTAward}</Card.Text>
              <Card.Text>LockingPeriod : {info.lockingPeriod}</Card.Text>
              <Card.Text>LockingUser : {info.lockingUser}</Card.Text>
              <Card.Text>FLM:FLUND : </Card.Text>
            </Card.Body>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleDeposit}>
              Deposit Now!
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      
      
    );
  };
  
export default Deposit;