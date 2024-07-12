import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Button, Carousel } from 'react-bootstrap';
import axiosInstance from '../services/axiosInstance';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faTag, faStar, faBook, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

const TestSeriesDetailPage = () => {
  const { testSeriesId } = useParams();
  const [testSeries, setTestSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTest, setExpandedTest] = useState(null);

  useEffect(() => {
    const fetchTestSeriesData = async () => {
      try {
        const response = await axiosInstance.get(`/testseries/${testSeriesId}`);
        setTestSeries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test series data:', error);
      }
    };

    fetchTestSeriesData();
  }, [testSeriesId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleToggleExpand = (testId) => {
    if (expandedTest === testId) {
      setExpandedTest(null);
    } else {
      setExpandedTest(testId);
    }
  };

  return (
    <Container className='mt-5 mb-5'>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Img variant="top" src={testSeries.thumbnail} />
            <Card.Body>
              <Card.Title className='mb-4'>
                <strong>Title: </strong>{testSeries.title}{' '}
                <FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginLeft: '5px' }} />
              </Card.Title>
              <Card.Text><strong>Description: </strong>{testSeries.description}</Card.Text>
              <div className="mt-3">
                <strong>Price: </strong>₹ {testSeries.price}
              </div>
              <div className="mt-3">
                <strong>Created By: </strong>
                <FontAwesomeIcon icon={faChalkboardTeacher} />
                {testSeries.createdBy.name}
              </div>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Header>Tests</Card.Header>
            <ListGroup variant="flush">
              {testSeries.tests.map((test, index) => (
                <ListGroup.Item key={index}>
                  <div onClick={() => handleToggleExpand(test._id)}>
                    <h5>
                      Test {index + 1}{' '}
                      {expandedTest === test._id ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                      )}
                      <FontAwesomeIcon icon={faBook} />
                    </h5>
                    {expandedTest === test._id && (
                      <div>
                        <p><strong>Title: </strong>{test.title}</p>
                        <p><strong>Description: </strong>{test.description}</p>
                        {/* You can add more details about the test here */}
                      </div>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={4}>
          <Row>
            <Col>
              <Button variant="primary" className="mt-3 w-100">
                Buy Now
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="mt-3">
              <Card>
                <Card.Header>Reviews</Card.Header>
                <Carousel interval={null} className="mt-3">
                  {testSeries.reviews.map((review, index) => (
                    <Carousel.Item key={index}>
                      <Card.Body>
                        <Card.Title>{review.user.name}</Card.Title>
                        <div className="mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <FontAwesomeIcon key={i} icon={faStar} style={{ color: 'gold', marginRight: '2px' }} />
                          ))}
                        </div>
                        <Card.Text>{review.comment}</Card.Text>
                      </Card.Body>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default TestSeriesDetailPage;
