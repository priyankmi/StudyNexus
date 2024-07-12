// src/components/Navigation.js
import React, { useState } from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Navigation = ({ role, onItemClick }) => {
  const [selectedNavItem, setSelectedNavItem] = useState('profile'); // Initial selected item

  const handleItemClick = (itemName) => {
    setSelectedNavItem(itemName);
    onItemClick(itemName); // Callback to parent component (DashboardPage)
  };

  const navigationItems = [
    { id: 'profile', text: 'Profile' },
    { id: role === 'student' ? 'enrolled-courses' : 'my-courses', text: 'Courses' },
    { id: role === 'student' ? 'enrolled-test-series' : 'my-test-series', text: 'Test Series' },
  ];

  return (
    <Paper elevation={2} style={{ padding: '10px' }}>
      <Typography variant="h6">Navigation</Typography>
      <List component="nav">
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            button
            selected={selectedNavItem === item.id}
            onClick={() => handleItemClick(item.id)}
            component={Link}
            to={`/${item.id}`}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Navigation;
