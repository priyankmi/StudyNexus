import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import axiosInstance from "../services/axiosInstance";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faImages, faFileAlt, faTags, faMoneyBillAlt, faAlignLeft } from "@fortawesome/free-solid-svg-icons";

const CreateCoursePage = () => {
  const [categories, setCategories] = useState([]);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    tags: "",
  });
  const [thumbnail, setThumbnail] = useState(null); // State for thumbnail file
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

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
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(courseData).forEach((key) => {
        formData.append(key, courseData[key]);
      });
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      const response = await axiosInstance.post("/courses/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Course created successfully:", response.data);
      const courseId = response.data._id; // Assuming the response contains courseId
      navigate(`/upload-lectures/${courseId}`); // Navigate to UploadLecturesPage with courseId
    } catch (error) {
      console.error("Error creating course:", error);
      // Handle error state or show error message to user
    }
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
                <p className="fs-1">Create Course</p>
              </Card.Title>
              <Form onSubmit={handleNext}>
                <Form.Group controlId="formCourseTitle" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faAlignLeft} className="me-2" />
                    Course Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={courseData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formCourseDescription" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                    Course Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formCourseThumbnail" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faImages} className="me-2" />
                    Course Thumbnail
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
                <Form.Group controlId="formCourseCategory" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faTags} className="me-2" />
                    Course Category
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={courseData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formCoursePrice" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faMoneyBillAlt} className="me-2" />
                    Course Price
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={courseData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formCourseTags" className="mb-3">
                  <Form.Label>
                    <FontAwesomeIcon icon={faTags} className="me-2" />
                    Tags
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={courseData.tags}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="primary" type="submit">
                    Save and Next
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateCoursePage;
