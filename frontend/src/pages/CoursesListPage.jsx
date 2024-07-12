import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';
import FilterBar from '../components/FilterBar';
import PaginationComponent from '../components/PaginationComponent';
import axiosInstance from '../services/axiosInstance';

const ITEMS_PER_PAGE = 10;

const CoursesPage = () => {
  const [coursesList, setCoursesList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/courses/');
      setCoursesList(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const applyFilters = ({ priceRange, selectedCategories, selectedAuthors }) => {
    let filtered = coursesList.filter(course => {
      if (course.price > priceRange) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(course.category)) return false;
      if (selectedAuthors.length > 0 && !selectedAuthors.includes(course.createdBy._id)) return false;
      return true;
    });
    setFilteredCourses(filtered);
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
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={3}>
          <FilterBar applyFilters={applyFilters} />
        </Col>
        <Col md={9}>
          {currentItems.map((course) => (
            <Card key={course._id} className="mb-4">
              <Row>
                <Col md={3}>
                  <Image src={course.thumbnail} fluid />
                </Col>
                <Col md={9}>
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <Link 
                          to={`/courses/${course._id}`} 
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          <Card.Title className="font-weight-bold">{course.title}</Card.Title>
                        </Link>
                        <Card.Text>{course.description}</Card.Text>
                        <div className="mb-2">
                          {course.reviews.length > 0 ? (
                            <div>
                              <h5><FontAwesomeIcon icon={solidStar} className="text-warning" /> Rating:</h5>
                              <div className="mb-2">
                                {renderStars(course.reviews.rating)}
                                <span className="ml-2">{course.reviews.rating.toFixed(1)} / 5</span>
                              </div>
                            </div>
                          ) : (
                            <p>No ratings yet.</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <h3>₹{course.price}</h3>
                      </div>
                    </div>
                    <Card.Text>
                      Created By: {course.instructor.firstName} {course.instructor.lastName}
                    </Card.Text>
                    <Button variant="primary">Buy Now</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
          <PaginationComponent
            totalItems={filteredCourses.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CoursesPage;
