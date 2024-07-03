import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // if user typed in correct credentials, navigate to "/dashboard" endpoint
    if (username === 'user' && password === 'password') {
      console.log('Username:', username);
      console.log('Password:', password);
      navigate('/dashboard');
    } else {
      console.log('Invalid credentials');
    }
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit} className='login-form'>
        <div className='form-group'>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Login</button>
      </form>
      {/* conditional rendering: if isAuthenticated fn is true, take us to the route */}
      {isAuthenticated && (
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      )}
    </div>
  );
};

export default Login;
