import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import axiosInstance from '../services/axiosInstance'; // Import axiosInstance
import PaginationComponent from '../components/PaginationComponent'; // Import PaginationComponent

const TestLivePage = () => {
  const { testId } = useParams(); // Read testId from URL params using React Router
  const navigate = useNavigate(); // Use navigate for programmatic navigation
  const itemsPerPage = 1; // Number of questions per page
  const [testData, setTestData] = useState(null); // State to hold test data
  const [questions, setQuestions] = useState([]); // State to hold questions
  const [currentPage, setCurrentPage] = useState(1); // State for current page of questions
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 }); // State for time left
  const [showEndModal, setShowEndModal] = useState(false); // State for showing end modal
  const [testEnded, setTestEnded] = useState(false); // State to track if test has ended

  useEffect(() => {
    // Function to fetch test data including questions based on testId
    const fetchTestData = async () => {
      try {
        const response = await axiosInstance.get(`/test/${testId}`); // Fetch test data by testId
        setTestData(response.data); // Set fetched test data
        setQuestions(response.data.questions); // Set fetched questions from test data

        // Check if test has started
        const startTime = new Date(response.data.startTime);
        if (new Date() < startTime) {
          navigate(`/test/${testId}/waiting`); // Redirect to waiting page if test hasn't started
          return;
        }

        // Calculate and update time left until test end
        const endTime = new Date(response.data.endTime);
        const timerInterval = setInterval(() => {
          const timeLeft = calculateTimeLeft(endTime);
          setTimeLeft(timeLeft);

          // Check if time is up
          if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
            clearInterval(timerInterval); // Stop the timer
            handleResponseSubmit(); // Automatically submit responses
            setTestEnded(true); // Set testEnded to true
            setShowEndModal(true); // Show modal indicating test end
          }

          // Check if user has already submitted responses
          if (testEnded) {
            clearInterval(timerInterval); // Stop the timer
            setShowEndModal(true); // Show modal indicating test end
          }
        }, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(timerInterval);
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    fetchTestData(); // Fetch test data on component mount
  }, [testId, navigate]); // Re-fetch data when testId changes

  const calculateTimeLeft = (endTime) => {
    const difference = endTime - new Date();
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
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update currentPage state
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].selectedOption = optionIndex;
    setQuestions(updatedQuestions);
  };

  const handleClearOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].selectedOption = undefined; // Clear selected option
    setQuestions(updatedQuestions);
  };

  const handleResponseSubmit = async () => {
    // Check if the test has already ended
    setTestEnded(true);

    // Implement logic to submit responses to backend
    try {
      const response = await axiosInstance.put(`/test/${testId}/submit`, {
        test: testId,
        startTime: testData.startTime, // Include startTime in the submission data
        answers: questions.map(question => ({
          question: question._id,
          answer: question.selectedOption, // Assuming selectedOption is stored in question state
        })),
        submittedAt: new Date()
      });
      console.log('Response submitted successfully:', response.data);
      setTestEnded(true);
      // Optionally show a modal indicating responses have been saved
      setShowEndModal(true);
    } catch (error) {
      console.error('Error submitting response:', error);
      // Optionally handle error
    }
  };

  const handleCloseEndModal = () => {
    if (testEnded) {
      navigate(`/test/${testId}/result`); // Navigate to results page if test has ended
    } else {
      setShowEndModal(false); // Close the end modal
    }
  };

  if (!testData) return null; // Render nothing if testData is null

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">{testData.title}</Card.Title>
              <Card.Text className="text-center">{testData.description}</Card.Text>
              <Row className="text-center">
                <Col>
                  <p>Time Left: {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s</p>
                </Col>
              </Row>
              {questions.length > 0 && (
                <div>
                  <h5>Question {currentPage}</h5>
                  <p>{questions[currentPage - 1].content}</p>
                  <ul>
                    {questions[currentPage - 1].options.map((option, optionIndex) => (
                      <li key={optionIndex}>
                        <label>
                          <input
                            type="radio"
                            name={`question_${currentPage}`}
                            checked={questions[currentPage - 1].selectedOption === optionIndex}
                            onChange={() => handleOptionSelect(currentPage - 1, optionIndex)}
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Button variant="primary" onClick={() => handleClearOption(currentPage - 1)}>Clear Option</Button>
                  </div>
                </div>
              )}
              <PaginationComponent
                totalItems={questions.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
              <div className="text-center mt-4">
                <Button variant="danger" onClick={handleResponseSubmit}>Submit Responses</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Modal for Test End or Responses Saved */}
      <Modal show={showEndModal} onHide={handleCloseEndModal}>
        <Modal.Header closeButton>
          <Modal.Title>{"Responses Saved"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {timeLeft===0 ? (
            <p>The test has ended. Your responses have been submitted successfully.</p>
          ) : (
            <p>Your responses have been saved successfully. Results will be generated after the test time is complete.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {timeLeft===0 ? (
            <Button variant="primary" onClick={handleCloseEndModal}>
              Click here to see results
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleCloseEndModal}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TestLivePage;
