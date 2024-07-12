import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlay } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../services/axiosInstance'; // Import axiosInstance

const TestPage = () => {
  const { testId } = useParams(); // Read testId from URL params using React Router
  const navigate = useNavigate(); // Initialize useNavigate hook for programmatic navigation
  const [testData, setTestData] = useState(null); // State to hold test data
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft()); // State for countdown timer

  useEffect(() => {
    // Function to fetch test data
    const fetchTestData = async () => {
      try {
        const response = await axiosInstance.get(`/test/${testId}`); // Fetch test data using testId param
        setTestData(response.data); // Set fetched test data
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    fetchTestData(); // Fetch test data on component mount
  }, [testId]); // Re-fetch data when testId changes

  useEffect(() => {
    // Timer to update countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer); // Clean up timer on component unmount
  }, [testData]); // Re-calculate timeLeft when testData changes

  // Function to calculate time left until test start
  function calculateTimeLeft() {
    if (!testData) return { hours: 0, minutes: 0, seconds: 0 }; // Return default if testData is null

    const difference = new Date(testData.startTime) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = { hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  }

   // Function to handle starting the test
   const startTest = async () => {
    try {
      // Call the start test API
      const response = await axiosInstance.post(`/test/${testId}/start`);
      
      // Implement logic to handle the response, if needed
      console.log("Test started:", response.data);

      // Redirect to the actual test taking page with the specific testId
      navigate(`/test/${testId}`);
    } catch (error) {
      console.error('Error starting test:', error);
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">{testData ? testData.title : 'Loading...'}</Card.Title>
              {testData && (
                <>
                  <Card.Text className="text-center">{testData.description}</Card.Text>
                  <Row className="text-center">
                    <Col>
                      <p><FontAwesomeIcon icon={faClock} className="mr-2" /> Start Time: {new Date(testData.startTime).toLocaleString()}</p>
                    </Col>
                    <Col>
                      <p><FontAwesomeIcon icon={faClock} className="mr-2" /> End Time: {new Date(testData.endTime).toLocaleString()}</p>
                    </Col>
                  </Row>
                  <Row className="text-center">
                    <Col>
                      <p><FontAwesomeIcon icon={faClock} className="mr-2" /> Duration: {testData.duration} minutes</p>
                    </Col>
                    <Col>
                      <p><FontAwesomeIcon icon={faPlay} className="mr-2" /> Number of Questions: {testData.questions.length}</p>
                    </Col>
                  </Row>
                  <Row className="text-center">
                    <Col>
                      {timeLeft.hours !== 0 || timeLeft.minutes !== 0 || timeLeft.seconds !== 0 ? (
                        <p>Time Left: {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s</p>
                      ) : (
                        <p>Test is live!</p>
                      )}
                    </Col>
                  </Row>
                  <div className="text-center mt-4">
                    <Button
                      variant="primary"
                      onClick={startTest}
                      disabled={new Date() < new Date(testData.startTime)}
                      style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
                      className="test-start-button"
                    >
                      <FontAwesomeIcon icon={faPlay} className="mr-2" /> Start Test
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestPage;
