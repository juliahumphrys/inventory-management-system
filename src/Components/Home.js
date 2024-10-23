import React from 'react';

function Home() {
  return (
    <div className="text-center">
      <h1>Welcome to Aurora Community Theater's Inventory Management System</h1>
      <img src="/ACT-logo.png" alt="Theater" style={{ width: '50%', height: 'auto' }} />
      <h5>
        Over the years, ACT has earned the admiration of their patrons...
        This inventory management system is used to track ACT's assets. To add, edit, and view items, please use the navigation bar above.
      </h5>
    </div>
  );
}

export default Home;