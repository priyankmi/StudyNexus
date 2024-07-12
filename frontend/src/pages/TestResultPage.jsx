import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axiosInstance from '../services/axiosInstance';
import PaginationComponent from '../components/PaginationComponent'; // Assuming PaginationComponent is imported correctly

const TestResultPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [testData, setTestData] = useState(null);
  const [response, setResponse] = useState(null);
  const itemsPerPage = 1; // Number of questions per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page of questions

  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        const testResponse = await axiosInstance.get(`/test/${testId}`);
        setTestData(testResponse.data);

        const response = await axiosInstance.get(`/test/${testId}/result`);
        setResponse(response.data);
      } catch (error) {
        console.error('Error fetching test result:', error);
      }
    };

    fetchTestResult();
  }, [testId]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update currentPage state
  };

  const handleViewLeaderboard = () => {
    navigate(`/test/${testId}/leaderboard`); // Redirect to leaderboard page
  };

  if (!testData || !response) return null;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">{testData.title}</Card.Title>
              <Card.Text className="text-center">{testData.description}</Card.Text>
              <Card.Text className="text-center">Total Marks: {response.score}</Card.Text>

              <h5>Your Responses</h5>
              {response.answers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((answer, index) => (
                <div key={index} className="mb-4 border p-3">
                  <p><strong>Question {index + 1 + (currentPage - 1) * itemsPerPage}:</strong> {testData.questions[index + (currentPage - 1) * itemsPerPage].content}</p>
                  <ul>
                    {testData.questions[index + (currentPage - 1) * itemsPerPage].options.map((option, optionIndex) => (
                      <li key={optionIndex}>
                        <label>
                          <input
                            type="radio"
                            checked={answer.answer === optionIndex}
                            disabled
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <p><strong>Correct Answer:</strong> {testData.questions[index + (currentPage - 1) * itemsPerPage].options[testData.questions[index + (currentPage - 1) * itemsPerPage].correctAnswer]}</p>
                  {answer.markAwarded > 0 ? (
                    <p><strong>Marks Awarded:</strong> {answer.markAwarded}</p>
                  ) : (
                    <p><strong>Marks Awarded:</strong> 0</p>
                  )}
                </div>
              ))}
              <PaginationComponent
                totalItems={response.answers.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
              <div className="text-center mt-4">
                <Button variant="primary" onClick={handleViewLeaderboard}>View Leaderboard</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestResultPage;
