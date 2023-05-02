import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { lockingData } from "./data.js";
neolineN3.getTransaction({
  txid: '0xe5a5fdacad0ba4e8d34d2fa0638357adb0f05e7fc902ec150739616320870f50'
})
.then(result => {
  console.log('Transaction details: ' + JSON.stringify(result));
})
.catch((error) => {
  const {type, description, data} = error;
  switch(type) {
      case 'NO_PROVIDER':
          console.log('No provider available.');
          break;
      case 'RPC_ERROR':
          console.log('There was an error when broadcasting this transaction to the network.');
          break;
      default:
          // Not an expected error object.  Just write the error to the console.
          console.error(error);
          break;
  }
});

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
                  <Card.Text>LockingFinishTime : {data.lockingFinishTime}</Card.Text>
                  <Button variant="danger">Show more</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      
    );
}
  
export default Home;