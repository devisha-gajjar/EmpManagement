// src/components/GlobalLoader.tsx
import React from 'react';
import './GlobalLoader.css'; // You can create your custom CSS for the loader

const GlobalLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default GlobalLoader;
