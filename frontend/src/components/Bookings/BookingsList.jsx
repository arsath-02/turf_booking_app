import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingPage = () => {
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:3000/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBookingData(response.data.data[0]);
      } catch (error) {
        console.error('Error fetching booking data:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data.message : 'Failed to load booking data.');
      }
    };

    fetchData();
  }, []);

 
  if (bookingData === null) {
    return <div className="text-center text-yellow-600">No booking available.</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (!bookingData) {
    return <div className="flex-center text-center text-green-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg text-gray-800">
      <h1 className="text-3xl font-extrabold text-green-800 mb-6 border-b-4 border-green-700 pb-2">Your Booking</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div><strong className="text-green-700">Turf Name:</strong> {bookingData.turfId?.name || 'N/A'}</div>
        <div><strong className="text-green-700">Location:</strong> {bookingData.turfId?.location || 'N/A'}</div>
        <div><strong className="text-green-700">Booking Date:</strong> {new Date(bookingData.bookingDate).toLocaleDateString()}</div>
        <div><strong className="text-green-700">Start Time:</strong> {bookingData.startTime}</div>
        <div><strong className="text-green-700">End Time:</strong> {bookingData.endTime}</div>
        <div><strong className="text-green-700">Total Amount:</strong> ${bookingData.totalAmount}</div>
        <div><strong className="text-green-700">Payment Status:</strong> {bookingData.paymentStatus}</div>
      </div>
    </div>
  );
};

export default BookingPage;