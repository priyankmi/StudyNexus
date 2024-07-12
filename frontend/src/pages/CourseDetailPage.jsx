import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Button, Carousel } from 'react-bootstrap';
import axiosInstance from '../services/axiosInstance';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faTag, faStar, faVideo, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'; // Font Awesome icons

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLecture, setExpandedLecture] = useState(null); // Track which lecture's content is expanded

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseResponse = await axiosInstance.get(`courses/${courseId}`);
        setCourse(courseResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleToggleExpand = (lectureId) => {
    if (expandedLecture === lectureId) {
      setExpandedLecture(null);
    } else {
      setExpandedLecture(lectureId);
    }
  };

  return (
    <Container className='mt-5 mb-5'>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Img variant="top" src={course.thumbnail} />
            <Card.Body>
              <Card.Title className='mb-4'>
                <strong>Title: </strong>{course.title}{' '}
                <FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginLeft: '5px' }} />
              </Card.Title>
              <Card.Text><strong>Description: </strong>{course.description}</Card.Text>
              <div className="mt-3">
                <strong>Price: </strong>₹ {course.price}
              </div>
              <div className="mt-3">
                <strong>Instructor: </strong>
                <FontAwesomeIcon icon={faChalkboardTeacher} />
                {course.instructor.name}
              </div>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Header>Lectures</Card.Header>
            <ListGroup variant="flush">
              {course.lectures.map((lecture, index) => (
                <ListGroup.Item key={index}>
                  <div onClick={() => handleToggleExpand(lecture._id)}>
                    <h5>
                      Lecture {index + 1}{' '}
                      {expandedLecture === lecture._id ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                      )}
                      <FontAwesomeIcon icon={faVideo} />
                    </h5>
                    {expandedLecture === lecture._id && (
                      <div>
                        <p><strong>Title: </strong>{lecture.title}</p>
                        <p><strong>Description: </strong>{lecture.description}</p>
                        <video width="100%" height="auto" controls>
                          <source src={lecture.video} type="video/mp4" />
                        </video>
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
                  {course.reviews.map((review, index) => (
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

export default CourseDetailPage;
