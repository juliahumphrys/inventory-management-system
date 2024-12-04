import React, { useState, useEffect } from 'react';
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
import GeneralLogin from './Components/GeneralLogin';
import SearchResults from './Components/SearchResults';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Simulate login check on mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
    setIsLoading(false); // Finished checking
  }, []);

  // Save login state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  if (isLoading) {
    // Prevent rendering anything until the login status is determined
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>MyTrackIMS</h1>
        </header>

        {/* Render the NavBar for logged-in users */}
        {isLoggedIn && <NavBar />}

        <Routes>
          {/* Routes with login validation */}
          <Route path="/" element={<GeneralLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <GeneralLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/inventory" element={isLoggedIn ? <Inventory /> : <GeneralLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/reports" element={isLoggedIn ? <Reports /> : <GeneralLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/developers" element={isLoggedIn ? <Developers /> : <GeneralLogin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
