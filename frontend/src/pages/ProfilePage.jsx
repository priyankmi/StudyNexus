import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faUserCircle, faBirthdayCake, faEdit, faSave, faMars, faVenus, faGenderless } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../services/axiosInstance';
import Sidebar from '../components/Sidebar';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [editMode, setEditMode] = useState(false); // Track edit mode state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    gender: '',
    about: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/getProfile');
        setProfileData(response.data);
        setFormData(response.data); // Initialize form data with fetched profile
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false); // Set loading to false on error
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    setEditMode(true); // Enable edit mode
  };

  const handleSaveProfile = async () => {
    try {
      // Update profile data on the server
      await axiosInstance.put('/dashboard/updateProfile', formData);
      setProfileData(formData); // Update local profile data
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while fetching data
  }

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        {/* Main Content */}
        <Col md={9} className="p-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-end mb-3">
                {editMode ? (
                  <Button variant="outline-primary" onClick={handleSaveProfile}>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save
                  </Button>
                ) : (
                  <Button variant="outline-primary" onClick={handleEditProfile}>
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Edit
                  </Button>
                )}
              </div>
              <Card.Title className="text-center"><p className="fs-1">My Profile</p></Card.Title>
              <Card.Text>
                {editMode ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label><FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} /> First Name</Form.Label>
                      <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label><FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} /> Last Name</Form.Label>
                      <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label><FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px' }} /> Email</Form.Label>
                      <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label><FontAwesomeIcon icon={faBirthdayCake} style={{ marginRight: '10px' }} /> Date of Birth</Form.Label>
                      <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label><FontAwesomeIcon icon={faGenderless} style={{ marginRight: '10px' }} /> Gender</Form.Label>
                      <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label><FontAwesomeIcon icon={faUserCircle} style={{ marginRight: '10px' }} /> About</Form.Label>
                      <Form.Control as="textarea" rows={3} name="about" value={formData.about} onChange={handleChange} />
                    </Form.Group>
                  </Form>
                ) : (
                  <>
                    <div className="mb-3">
                      <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.2rem', marginRight: '10px' }} />
                      <strong style={{ fontSize: '1.2rem', fontFamily: 'Roboto', fontWeight: 'bold' }}>Name:</strong> {profileData.firstName} {profileData.lastName}
                    </div>
                    <div className="mb-3">
                      <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '1.2rem', marginRight: '10px' }} />
                      <strong style={{ fontSize: '1.2rem', fontFamily: 'Roboto', fontWeight: 'bold' }}>Email:</strong> {profileData.email}
                    </div>
                    <div className="mb-3">
                      <FontAwesomeIcon icon={faBirthdayCake} style={{ fontSize: '1.2rem', marginRight: '10px' }} />
                      <strong style={{ fontSize: '1.2rem', fontFamily: 'Roboto', fontWeight: 'bold' }}>Date of Birth:</strong> {new Date(profileData.dob).toLocaleDateString()}
                    </div>
                    <div className="mb-3">
                      <FontAwesomeIcon icon={profileData.gender === 'Male' ? faMars : (profileData.gender === 'Female' ? faVenus : faGenderless)} style={{ fontSize: '1.2rem', marginRight: '10px' }} />
                      <strong style={{ fontSize: '1.2rem', fontFamily: 'Roboto', fontWeight: 'bold' }}>Gender:</strong> {profileData.gender}
                    </div>
                    <div className="mb-3">
                      <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '1.2rem', marginRight: '10px' }} />
                      <strong style={{ fontSize: '1.2rem', fontFamily: 'Roboto', fontWeight: 'bold' }}>About:</strong> {profileData.about}
                    </div>
                  </>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
