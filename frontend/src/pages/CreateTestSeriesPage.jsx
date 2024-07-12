import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import axiosInstance from "../services/axiosInstance";
import Sidebar from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faImages, faFileAlt, faTag, faMoneyBillAlt, faPlusCircle, faCheck } from "@fortawesome/free-solid-svg-icons";

const CreateTestSeriesPage = () => {
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testSeriesData, setTestSeriesData] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    tests: [], // Array to hold selected tests
  });
  const [thumbnail, setThumbnail] = useState(null); // State for thumbnail file
  const [showModal, setShowModal] = useState(false); // State for modal dialog

  useEffect(() => {
    fetchTests();
    fetchCategories();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axiosInstance.get("/test/");
      setTests(response.data.tests);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/category/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestSeriesData({
      ...testSeriesData,
      [name]: value,
    });
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleCheckboxChange = (testId) => {
    const isChecked = testSeriesData.tests.includes(testId);
    if (isChecked) {
      setTestSeriesData({
        ...testSeriesData,
        tests: testSeriesData.tests.filter((id) => id !== testId),
      });
    } else {
      setTestSeriesData({
        ...testSeriesData,
        tests: [...testSeriesData.tests, testId],
      });
    }
  };

  const handleDateChange = (testId, field, value) => {
    const updatedTests = tests.map((test) => {
      if (test._id === testId) {
        return { ...test, [field]: value };
      }
      return test;
    });

    setTests(updatedTests);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update test dates in the backend
    const updateTestDatesPromises = testSeriesData.tests.map((testId) => {
      const test = tests.find((test) => test._id === testId);
      return axiosInstance.put(`/test/update-dates/${testId}`, {
        startTime: test.startTime,
        endTime: test.endTime,
      });
    });

    try {
      await Promise.all(updateTestDatesPromises);
      console.log("Test dates updated successfully");

      const formData = new FormData();
      Object.keys(testSeriesData).forEach((key) => {
        if (key === "tests") {
          formData.append(key, JSON.stringify(testSeriesData[key]));
        } else {
          formData.append(key, testSeriesData[key]);
        }
      });
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      
      const response = await axiosInstance.post("/testseries/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Test series created successfully:", response.data);

      // Reset form
      setTestSeriesData({
        title: "",
        description: "",
        price: 0,
        category: "",
        tests: [],
      });
      setThumbnail(null); // Clear thumbnail state
      setShowModal(true); // Show modal on success
    } catch (error) {
      console.error("Error creating test series:", error);
      // Handle error state or show error message to user
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
              <Card.Title className="text-center">
                <p className="fs-1">Create Test Series</p>
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTestSeriesTitle" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                    Test Series Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={testSeriesData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTestSeriesDescription" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faAlignLeft} className="me-2" />
                    Test Series Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={testSeriesData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formTestSeriesThumbnail" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faImages} className="me-2" />
                    Test Series Thumbnail
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="thumbnail"
                    onChange={handleThumbnailChange}
                    required
                  />
                  {thumbnail && (
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail Preview"
                      className="img-fluid mt-2"
                      style={{ maxHeight: "150px" }}
                    />
                  )}
                </Form.Group>
                <Form.Group controlId="formTestSeriesCategory" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faTag} className="me-2" />
                    Test Series Category
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={testSeriesData.category}
                    onChange={handleInputChange}
                    custom
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formTestSeriesTests" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faCheck} className="me-2" />
                    Tests to Add
                  </Form.Label>
                  <div>
                    {tests.map((test) => (
                      <div key={test._id} className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id={test._id}
                          label={test.title}
                          checked={testSeriesData.tests.includes(test._id)}
                          onChange={() => handleCheckboxChange(test._id)}
                        />
                        <Row className="mt-2">
                          <Col sm={6}>
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                              type="datetime-local"
                              value={test.startTime || ""}
                              onChange={(e) => handleDateChange(test._id, "startTime", e.target.value)}
                            />
                          </Col>
                          <Col sm={6}>
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                              type="datetime-local"
                              value={test.endTime || ""}
                              onChange={(e) => handleDateChange(test._id, "endTime", e.target.value)}
                            />
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group controlId="formTestSeriesPrice" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faMoneyBillAlt} className="me-2" />
                    Test Series Price (in INR)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={testSeriesData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Create Test Series
                </Button>
              </Form>
            </Card.Body>
          </Card>
          {/* Modal Dialog */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Test series created successfully!
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTestSeriesPage;
