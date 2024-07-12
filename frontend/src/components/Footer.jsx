import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About StudyNexus</h5>
            <p>StudyNexus is your go-to platform for comprehensive online courses , test series and discussion forum helping you excel in your exams and professional career.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
              <Nav.Link as={Link} to="/courses" className="text-white">Courses</Nav.Link>
              <Nav.Link as={Link} to="/test-series" className="text-white">Test Series</Nav.Link>
              <Nav.Link as={Link} to="/discuss" className="text-white">Discuss</Nav.Link>
            </Nav>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>Email: support@studynexus.com</p>
            <p>Phone: 12345</p>
            <div>
              <FontAwesomeIcon icon={faFacebook} size="2x" className="me-3 text-white" />
              <FontAwesomeIcon icon={faTwitter} size="2x" className="me-3 text-white" />
              <FontAwesomeIcon icon={faLinkedin} size="2x" className="me-3 text-white" />
              <FontAwesomeIcon icon={faInstagram} size="2x" className="text-white" />
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12} className="text-center">
            <p>&copy; {new Date().getFullYear()} StudyNexus. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
