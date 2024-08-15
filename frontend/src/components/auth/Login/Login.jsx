import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFormData = (data) => {
    if (!data.email || !data.password) {
      return 'All fields are required';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const validationError = validateFormData(formData);
    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      if (response.ok) {
        setMessage('Login successful!');
        const { token, user } = data.data;
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('token', token);
        if (user.role === 'admin') {
          navigate('/turfs');
        } else {
          navigate('/');
        }
      } else {
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/auth/register');
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white p-10 rounded-md w-full max-w-md">
        <h2 className="text-5xl font-semibold text-center text-green-600 mb-3">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full mt-4 p-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <a onClick={handleRegisterClick} className="text-green-600 hover:underline">
              Sign Up
            </a>
          </p>
          {errorMessage && <p className="mt-4 text-center text-red-500">{errorMessage}</p>}
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
