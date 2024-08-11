import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFormData = (data) => {
    if (!data.firstname || !data.lastname || !data.email || !data.password || !data.phonenumber) {
      return 'All fields are required';
    }
    
    return null;
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const validationError = validateFormData(formData);
    if (validationError) {
      setErrorMessage(validationError);
        setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;

    }
    console.log('Request Payload:', formData);

  
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(result.message || 'Registration failed');
        console.error('Error response:', result);
        return;
      }
  
      const result = await response.json();
      
      localStorage.setItem('token', result.data.token);
      alert("Registration successful!");
      
      navigate('/auth/login');
    } catch (error) {
        console.error('Error:', error);
      setErrorMessage(`Network error: ${error.message || 'Failed to fetch'}`);
      setLoading(false);
      
    }
  };
  
  const handleLoginClick = () => {
    navigate('/auth/login');
  };

  return (
    <div className="flex justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-md w-full max-w-md">
        <h1 className="text-5xl font-semibold text-center text-green-600 mb-3">Create An Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              autoComplete="given-name"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 text-gray-900">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              autoComplete="family-name"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              autoComplete="email"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>
          <div className="mb-2">
  <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
    Phone Number
  </label>
  <input
    type="tel"
    id="phonenumber"
    name="phonenumber"
    value={formData.phonenumber}
    onChange={handleChange}
    placeholder="Phone Number"
    autoComplete="tel"
    className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
  />
</div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="new-password"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              autoComplete="new-password"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>
          <button type="submit" className="w-full mt-4 p-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a onClick={handleLoginClick} className="text-green-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
