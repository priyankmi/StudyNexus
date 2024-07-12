import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../services/axiosInstance';

const FilterBarDiscuss = ({ applyFilters }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/category/');
        setCategories(response.data); // Assuming backend returns an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter(category => category !== value));
    }
  };

  const handleFilterApply = () => {
    applyFilters({ selectedCategories });
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Filters</Card.Title>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label><FontAwesomeIcon icon={faTags} className="mr-2" />Categories</Form.Label>
            {categories.length > 0 ? (
              categories.map(category => (
                <Form.Check
                  key={category._id}
                  type="checkbox"
                  value={category._id}
                  label={category.name}
                  onChange={handleCategoryChange}
                />
              ))
            ) : (
              <p>No categories available</p>
            )}
          </Form.Group>
          <button type="button" className="btn btn-primary" onClick={handleFilterApply}>Apply Filters</button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default FilterBarDiscuss;
