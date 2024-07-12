// services/courseService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/courses/:categoryId';

const getCoursesByCategory = async (category) => {
    const response = await axios.get(`${API_URL}?category=${category}`);
    return response.data;
};

export default {
    getCoursesByCategory,
};
