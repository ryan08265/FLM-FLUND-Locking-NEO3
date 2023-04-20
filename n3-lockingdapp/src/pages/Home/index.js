import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { lockingData } from "./data.js";
const Home = () => {
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
                  <Card.Text>lockingFinishTime : {data.lockingFinishTime}</Card.Text>
                  <Button bg="Success">Show more</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      
    );
}
  
export default Home;