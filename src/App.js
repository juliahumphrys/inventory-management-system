import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import Inventory from './Components/Inventory';
import Developers from './Components/Developers';
import './App.css';
import AdminPage from './Components/AdminPage';
import AdminLogin from './Components/AdminLogin';
import GeneralLogin from './Components/GeneralLogin';
import SearchResults from './Components/SearchResults';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  useEffect(() => {
    // Store the login state in localStorage whenever it changes
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          
          <h1>MyTrackIMS</h1>
          
        </header>

        {isLoggedIn && <NavBar />}

        <Routes>
          <Route path="/" element={<GeneralLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <GeneralLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/inventory" element={isLoggedIn ? <Inventory /> : <GeneralLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/Developers" element={isLoggedIn ? <Developers /> : <GeneralLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="search-results" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;