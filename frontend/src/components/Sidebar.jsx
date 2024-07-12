import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Nav, Navbar, Container } from 'react-bootstrap';
import axiosInstance from '../services/axiosInstance';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/getRole');
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    fetchRole();
  }, []);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Navbar expand="lg" className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <Container fluid>
        <Navbar.Toggle onClick={toggleCollapse} aria-controls="sidebar-nav" />
        <Navbar.Collapse id="sidebar-nav">
          <Nav className="flex-column border-end">
            <Nav.Item>
              <Nav.Link as={NavLink} to="/profile" activeClassName="active">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Profile
              </Nav.Link>
            </Nav.Item>
            {role === 'Instructor' ? (
              <>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/create-course" activeClassName="active">
                    <FontAwesomeIcon icon={faBook} className="me-2" />
                    Create Course
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/my-courses" activeClassName="active">
                    <FontAwesomeIcon icon={faBook} className="me-2" />
                    My Courses
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/create-test-series" activeClassName="active">
                    <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                    Create Test Series
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/my-test-series" activeClassName="active">
                    <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                    My Test Series
                  </Nav.Link>
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/enrolled-courses" activeClassName="active">
                    <FontAwesomeIcon icon={faBook} className="me-2" />
                    My Courses
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to="/enrolled-test-series" activeClassName="active">
                    <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                    My Test Series
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
            <Nav.Item>
              <Nav.Link as={NavLink} to="/logout" activeClassName="active">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Sidebar;
