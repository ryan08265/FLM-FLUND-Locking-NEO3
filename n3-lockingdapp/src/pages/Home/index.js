import React, {useState} from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { lockingData } from "./data.js";


const Home = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [info, setInfo] = useState([]);
    const handleShowMore = (data) => {
      setInfo(data)
      setShow(true);
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
                  <Card.Text>LockingStartTime : {data.lockingStatingTime}</Card.Text>
                  <Card.Text>LockingFinishTime : {data.lockingFinishTime}</Card.Text>
                  <Button variant="danger" onClick={() => handleShowMore(data)}>Show more</Button>
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
              <Card.Text>LockingStartTime : {info.lockingStatingTime}</Card.Text>
              <Card.Text>LockingFinishTime : {info.lockingFinishTime}</Card.Text>
              <Card.Text>LockingUser : {info.lockingUser}</Card.Text>
              <Card.Text>AwardUser : {info.awardUser}</Card.Text>

            </Card.Body>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      
    );
}
  
export default Home;