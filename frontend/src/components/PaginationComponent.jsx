import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a className="page-link" onClick={() => handlePageChange(currentPage - 1)} style={{ cursor: 'pointer' }}>Previous</a>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li
            key={index + 1}
            className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
          >
            <a className="page-link" onClick={() => handlePageChange(index + 1)} style={{ cursor: 'pointer' }}>{index + 1}</a>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a className="page-link" onClick={() => handlePageChange(currentPage + 1)} style={{ cursor: 'pointer' }}>Next</a>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationComponent;
