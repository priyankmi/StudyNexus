import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../services/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

const UploadLecturesPage = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([{ title: "", description: "", video: null }]);
  
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLectures = [...lectures];
    updatedLectures[index] = {
      ...updatedLectures[index],
      [name]: value,
    };
    setLectures(updatedLectures);
  };
  
  const handleVideoChange = (index, e) => {
    const updatedLectures = [...lectures];
    updatedLectures[index] = {
      ...updatedLectures[index],
      video: e.target.files[0],
    };
    setLectures(updatedLectures);
  };
  
  const handleAddLecture = () => {
    setLectures([
      ...lectures,
      {
        title: "",
        description: "",
        video: null,
      },
    ]);
  };
  
  const handleRemoveLecture = (index) => {
    const updatedLectures = [...lectures];
    updatedLectures.splice(index, 1);
    setLectures(updatedLectures);
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();
    console.log(lectures);
    const formData = new FormData();
    lectures.forEach((lecture, index) => {
      formData.append(`title${index}`, lecture.title);
      formData.append(`description${index}`, lecture.description);
      formData.append(`video${index}`, lecture.video);
    });
    try {
      const res = await axiosInstance.put(`/courses/upload-lectures/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload successful:', res.data);
      // Optionally, you can reset the form or handle success actions
    } catch (error) {
      console.error('Error uploading lectures:', error);
      // Handle error state or display error message to user
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
                <p className="fs-1">Upload Lectures</p>
              </Card.Title>
              <Form onSubmit={handleUpload}>
                {lectures.map((lecture, index) => (
                  <div key={index} className="mb-3">
                    <p className="fs-3">Lecture No. {index + 1}</p>
                    <Form.Group controlId={`lectureTitle${index}`} className="mb-3">
                      <Form.Label>Lecture Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={lecture.title}
                        onChange={(e) => handleInputChange(index, e)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId={`lectureDescription${index}`} className="mb-3">
                      <Form.Label>Lecture Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={lecture.description}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                    </Form.Group>
                    <Form.Group controlId={`lectureVideo${index}`} className="mb-3">
                      <Form.Label>Lecture Video</Form.Label>
                      <Form.Control
                        type="file"
                        name="video"
                        onChange={(e) => handleVideoChange(index, e)}
                        required
                      />
                    </Form.Group>
                    {index > 0 && (
                      <Button variant="danger" onClick={() => handleRemoveLecture(index)}>
                        <FontAwesomeIcon icon={faTimes} className="me-2" />
                        Remove Lecture
                      </Button>
                    )}
                    <hr />
                  </div>
                ))}
                <Button variant="primary" onClick={handleAddLecture}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add Lecture
                </Button>
                <Button variant="success" type="submit" className="ms-3">
                  <FontAwesomeIcon icon={faUpload} className="me-2" />
                  Upload Lectures
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UploadLecturesPage;
