import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/login.jsx';
import Home from './components/home.jsx';

export default function App() {
  return (
    <Router>
      <div>
        <h1 className='header'>DeClustor</h1>
        <nav>
          <Link to='/'>Home</Link>
          <br></br>
          <Link to='/login'>Login</Link>
        </nav>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}
