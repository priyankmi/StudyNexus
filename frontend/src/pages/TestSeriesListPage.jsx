import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import PaginationComponent from '../components/PaginationComponent';
import axiosInstance from '../services/axiosInstance';

const ITEMS_PER_PAGE = 10;

const TestSeriesPage = () => {
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTestSeries();
  }, []);

  const fetchTestSeries = async () => {
    try {
      const response = await axiosInstance.get('/testSeries/');
      setTestSeriesList(response.data);
      setFilteredSeries(response.data);
    } catch (error) {
      console.error('Error fetching test series:', error);
    }
  };

  const applyFilters = ({ priceRange, selectedCategories, selectedAuthors }) => {
    let filtered = testSeriesList.filter(series => {
      if (series.price > priceRange) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(series.category)) return false;
      if (selectedAuthors.length > 0 && !selectedAuthors.includes(series.createdBy._id)) return false;
      return true;
    });
    setFilteredSeries(filtered);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    let stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={solidStar} className="text-warning" />);
    }
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={regularStar} className="text-warning" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={regularStar} className="text-muted" />);
    }

    return stars;
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredSeries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={3}>
          <FilterBar applyFilters={applyFilters} />
        </Col>
        <Col md={9}>
          {currentItems.map((testSeries) => (
            <Card key={testSeries._id} className="mb-4">
              <Row>
                <Col md={3}>
                  <Image src={`http://localhost:5000${testSeries.thumbnail}`} fluid />
                </Col>
                <Col md={9}>
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <Card.Title className="font-weight-bold">
                          <Link to={`/test-series/${testSeries._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {testSeries.title}
                          </Link>
                        </Card.Title>
                        <Card.Text>{testSeries.description}</Card.Text>
                        <div className="mb-2">
                          {testSeries.reviews.length > 0 ? (
                            <div>
                              <h5><FontAwesomeIcon icon={solidStar} className="text-warning" /> Rating:</h5>
                              <div className="mb-2">
                                {renderStars(testSeries.reviews.rating)}
                                <span className="ml-2">{testSeries.reviews.rating.toFixed(1)} / 5</span>
                              </div>
                            </div>
                          ) : (
                            <p>No ratings yet.</p>
                          )}
                          <p>Number of Tests: {testSeries.tests.length}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <h3>₹{testSeries.price}</h3>
                      </div>
                    </div>
                    <Card.Text>
                      Created By: {testSeries.createdBy.firstName} {testSeries.createdBy.lastName}
                    </Card.Text>
                    <Button variant="primary">Buy Now</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
          <PaginationComponent
            totalItems={filteredSeries.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default TestSeriesPage;
