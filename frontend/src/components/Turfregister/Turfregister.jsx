import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TurfBooking = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: '',
    price: '',
    image: null,
    contactnumber: '',
    pricePerHour: '',
    city: '',
  });

  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/home');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'image' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, location, rating, price, contactnumber, pricePerHour, city, image } = formData;
    if (!name || !location || !price || !contactnumber || !pricePerHour || !city || !image) {
      alert('Please provide all required fields.');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post('http://localhost:3000/turfs', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Response:', response.data); // Log response data
      navigate('/success');
    } catch (error) {
      console.error('Error registering turf:', error);

      if (error.response) {
        alert(error.response.data.message || 'Failed to register turf');
      } else if (error.request) {
        alert('Network error: Please check your connection and try again.');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-md w-full max-w-md">
        <h1 className="text-5xl font-semibold text-center text-green-600 mb-3">Register a Turf</h1>
        {error && <p className="text-red-600 mb-3">{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          {['name', 'location', 'rating', 'price', 'contactnumber', 'pricePerHour', 'city'].map((field) => (
            <div key={field} className="mb-2">
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </label>
              <input
                type={field === 'contactnumber' ? 'text' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, ' $1')}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
          ))}
          <div className="mb-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 p-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TurfBooking;