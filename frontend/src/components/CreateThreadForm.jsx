import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const CreateThreadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from your backend API
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/category');
        setCategories(response.data); // Assuming response.data is an array of category objects or IDs
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Handle error state or display error message to the user
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/discuss/mainThread/create', {
        title,
        description,
        category,
      });
      console.log('New Thread Created:', response.data);
       navigate('/discuss')

      // Optionally, you can redirect to the newly created thread or handle success feedback
    } catch (error) {
      console.error('Error creating thread:', error);
      // Handle error state or display error message to the user
    }
  };

  return (
    <Container className="py-4 mt-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name} {/* Assuming 'name' is the field in your category object */}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className='mt-2'>
          Create Thread
        </Button>
      </Form>
    </Container>
  );
};

export default CreateThreadForm;
