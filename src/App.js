import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import './App.css'; // Importing the CSS file for custom styles

function App() {
  return (
    <Router>
      <div className="App">
        {/* Banner and Header */}
        <header className="app-header">
          <h1>StageTrack</h1>
        </header>

        <NavBar />

        {/* Routing to different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h1>Welcome to the Home Page</h1>;
}

function Inventory() {
  return <h1>Inventory Page</h1>;
}

function Reports() {
  return <h1>Reports Page</h1>;
}

export default App;
