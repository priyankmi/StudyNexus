import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading, faInfoCircle, faClock, faQuestionCircle, faDotCircle, faCheckCircle, faStar, faTrash, faPlusCircle, faSave } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../services/axiosInstance'; // Adjust the path to your axios instance
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const CreateTestPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [questions, setQuestions] = useState([{ content: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 }]);
    const [showModal, setShowModal] = useState(false); // State for modal dialog

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index][event.target.name] = event.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = event.target.value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { content: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const test = { title, description, startTime, endTime, questions };

        try {
            const response = await axiosInstance.post('/test/create', test);

            if (response.status === 201) {
                setShowModal(true); 
            } else {
                console.error('Error creating test:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // Reset form fields
        setTitle('');
        setDescription('');
        setStartTime('');
        setEndTime('');
        setQuestions([{ content: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 }]);
    };

    return (
        <Container fluid>
            <Row>
                {/* Sidebar */}
                <Col md={2} className="p-0">
                    <Sidebar />
                </Col>
                {/* Main Content */}
                <Col md={10} className="p-3">
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center">
                                <h1><FontAwesomeIcon icon={faPlusCircle} /> Create Test</h1>
                            </Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group as={Row} className="mb-3" controlId="formTitle">
                                    <Form.Label column sm={2}><FontAwesomeIcon icon={faHeading} /> Title</Form.Label>
                                    <Col sm={10}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter test title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formDescription">
                                    <Form.Label column sm={2}><FontAwesomeIcon icon={faInfoCircle} /> Description</Form.Label>
                                    <Col sm={10}>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter test description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formStartTime">
                                    <Form.Label column sm={2}><FontAwesomeIcon icon={faClock} /> Start Time</Form.Label>
                                    <Col sm={10}>
                                        <Form.Control
                                            type="datetime-local"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formEndTime">
                                    <Form.Label column sm={2}><FontAwesomeIcon icon={faClock} /> End Time</Form.Label>
                                    <Col sm={10}>
                                        <Form.Control
                                            type="datetime-local"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                {questions.map((question, qIndex) => (
                                    <div key={qIndex} className="mb-4">
                                        <h5><FontAwesomeIcon icon={faQuestionCircle} /> Question {qIndex + 1}</h5>
                                        <Form.Group as={Row} className="mb-2" controlId={`questionContent${qIndex}`}>
                                            <Form.Label column sm={2}><FontAwesomeIcon icon={faQuestionCircle} /> Content</Form.Label>
                                            <Col sm={10}>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    placeholder="Enter question"
                                                    name="content"
                                                    value={question.content}
                                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        {question.options.map((option, oIndex) => (
                                            <Form.Group as={Row} className="mb-2" controlId={`questionOption${qIndex}${oIndex}`} key={oIndex}>
                                                <Form.Label column sm={2}><FontAwesomeIcon icon={faDotCircle} /> Option {oIndex + 1}</Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder={`Enter option ${oIndex + 1}`}
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                                        required
                                                    />
                                                </Col>
                                            </Form.Group>
                                        ))}

                                        <Form.Group as={Row} className="mb-2" controlId={`correctAnswer${qIndex}`}>
                                            <Form.Label column sm={2}><FontAwesomeIcon icon={faCheckCircle} /> Correct Answer</Form.Label>
                                            <Col sm={10}>
                                                <Form.Control
                                                    as="select"
                                                    name="correctAnswer"
                                                    value={question.correctAnswer}
                                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                                    required
                                                >
                                                    {question.options.map((_, index) => (
                                                        <option key={index} value={index}>{index + 1}</option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-2" controlId={`marks${qIndex}`}>
                                            <Form.Label column sm={2}><FontAwesomeIcon icon={faStar} /> Marks</Form.Label>
                                            <Col sm={10}>
                                                <Form.Control
                                                    type="number"
                                                    name="marks"
                                                    value={question.marks}
                                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Button variant="danger" onClick={() => removeQuestion(qIndex)} className="mb-3">
                                            <FontAwesomeIcon icon={faTrash} /> Remove Question
                                        </Button>
                                    </div>
                                ))}

                                <Button variant="primary" onClick={addQuestion} className="mb-3">
                                    <FontAwesomeIcon icon={faPlusCircle} /> Add Question
                                </Button>

                                <div className="d-flex justify-content-end mb-5">
                                    <Button variant="success" type="submit">
                                        <FontAwesomeIcon icon={faSave} /> Create Test
                                    </Button>
                                </div>

                            </Form>

                            {/* Modal for showing test creation confirmation */}
                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Test Created</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Your test has been successfully created!</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateTestPage;
