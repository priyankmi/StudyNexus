import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPlus } from '@fortawesome/free-solid-svg-icons';
import FilterBarDiscuss from '../components/FilterBarDiscuss';
import PaginationComponent from '../components/PaginationComponent';
import axiosInstance from '../services/axiosInstance';
import { Link } from 'react-router-dom';

const ThreadListPage = () => {
  const [threads, setThreads] = useState([]); // Holds all threads
  const [filteredThreads, setFilteredThreads] = useState([]); // Holds filtered threads
  const [currentPage, setCurrentPage] = useState(1); // Tracks current page for pagination
  const itemsPerPage = 10; // Number of threads per page

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await axiosInstance.post('discuss/mainThread/getAll');
      setThreads(response.data);
      setFilteredThreads(response.data)
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const applyFilters = (selectedCategories) => {
    console.log('Selected categories:', selectedCategories);
    
    // Check if selectedCategories is an object with an array inside it
    if (selectedCategories && selectedCategories.selectedCategories && Array.isArray(selectedCategories.selectedCategories)) {
      console.log('Selected categories length:', selectedCategories.selectedCategories.length);
      console.log('First category:', selectedCategories.selectedCategories[0]);
      
      let filtered = threads.filter(thread => {
        return selectedCategories.selectedCategories.includes(thread.category);
      });
      
      console.log('Filtered threads:', filtered);
      setFilteredThreads(filtered);
    } else {
      console.log('Selected categories is not in the expected format or is empty.');
      // Handle the case where selectedCategories is not as expected
      setFilteredThreads(threads); // Reset to all threads if no valid filter is applied
    }
  };
  
  
  

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page
  };

  // Calculate indexes for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredThreads.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="my-4">
      <Row>
        {/* FilterBarDiscuss component for filtering threads */}
        <Col md={3}>
          <FilterBarDiscuss applyFilters={applyFilters} />
        </Col>
        {/* Displaying threads */}
        <Col md={9}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <h2>Threads List</h2>
              </Card.Title>
              {/* Link to create a new thread */}
              <Link to="/create-thread" className="btn btn-primary mb-2">
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Create Thread
              </Link>
              {/* Display threads or message if none */}
              {currentItems.length > 0 ? (
                currentItems.map((thread) => (
                  <Card key={thread._id} className="mb-3">
                    {/* Link to view thread details */}
                    <Link to={`/discuss/${thread._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card.Body>
                        <Card.Title>{thread.title}</Card.Title>
                        <Card.Text>
                          {/* Display creation date */}
                          <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                          Created At: {new Date(thread.createdAt).toLocaleDateString()}
                        </Card.Text>
                        {/* Additional details as needed */}
                      </Card.Body>
                    </Link>
                  </Card>
                ))
              ) : (
                <p>No threads found.</p>
              )}
              {/* PaginationComponent for pagination controls */}
              <PaginationComponent
                totalItems={filteredThreads.length}
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

export default ThreadListPage;
