import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faTags, faUser } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../services/axiosInstance';

const FilterBar = ({ applyFilters }) => {
  const [priceRange, setPriceRange] = useState(20000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/category/');
        setCategories(response.data); // Assuming backend returns an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchAuthors = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/instructors/');
        setAuthors(response.data); // Assuming backend returns an array of authors
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchCategories();
    fetchAuthors();
  }, []);

  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter(category => category !== value));
    }
  };

  const handleAuthorChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedAuthors([...selectedAuthors, value]);
    } else {
      setSelectedAuthors(selectedAuthors.filter(author => author !== value));
    }
  };

  const handleFilterApply = () => {
    applyFilters({ priceRange, selectedCategories, selectedAuthors });
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Filters</Card.Title>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Price Range: ₹{priceRange}
            </Form.Label>
            <Form.Control
              type="range"
              min={0}
              max={20000}
              step={100}
              value={priceRange}
              onChange={handlePriceChange}
            />
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label><FontAwesomeIcon icon={faUser} className="mr-2" />Authors</Form.Label>
            {authors.length > 0 ? (
              authors.map(author => (
                <Form.Check
                  key={author._id}
                  type="checkbox"
                  value={author._id}
                  label={`${author.firstName} ${author.lastName}`}
                  onChange={handleAuthorChange}
                />
              ))
            ) : (
              <p>No authors available</p>
            )}
          </Form.Group>
          <button type="button" className="btn btn-primary" onClick={handleFilterApply}>Apply Filters</button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default FilterBar;
