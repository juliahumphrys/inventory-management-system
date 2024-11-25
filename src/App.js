import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import Inventory from './Components/Inventory';
import Developers from './Components/Developers';
import './App.css';
import Reports from './Components/Reports';
import AdminPage from './Components/AdminPage';
import AdminLogin from './Components/AdminLogin';
import SearchResults from './Components/SearchResults';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>ACT Inventory</h1>
        </header>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/Developers" element={<Developers />} />
          <Route path="/Search-Results.html" element={<SearchResults />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/adminpage" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;