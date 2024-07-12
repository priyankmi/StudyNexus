import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Card } from 'react-bootstrap';
import axiosInstance from '../services/axiosInstance';
import { useParams } from 'react-router';
import PaginationComponent from '../components/PaginationComponent'; // Import PaginationComponent

const LeaderboardPage = () => {
  const { testId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [testTitle, setTestTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 5; // Number of entries per page

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axiosInstance.get(`/test/${testId}/leaderboard`); // Adjust endpoint as per your backend route
        setTestTitle(response.data.testTitle);
        setLeaderboard(response.data.leaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Handle error fetching leaderboard data
      }
    };

    fetchLeaderboard();
  }, [testId]);

  // Function to format time from seconds to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate current items to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboard.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">{testTitle}</Card.Title>
              <Card.Title className="text-center">Leaderboard</Card.Title>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student Name</th>
                    <th>Score</th>
                    <th>Time Taken (minutes:seconds)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.rank}</td>
                      <td>{entry.studentName}</td>
                      <td>{entry.score}</td>
                      <td>{formatTime(entry.timeTaken)}</td> {/* Format time here */}
                    </tr>
                  ))}
                </tbody>
              </Table>

              <PaginationComponent
                totalItems={leaderboard.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LeaderboardPage;
