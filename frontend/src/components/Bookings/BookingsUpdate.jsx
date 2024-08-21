import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateBooking = () => {
    const location = useLocation();
    const { booking } = location.state || {};
    const [bookingDate, setBookingDate] = useState(booking.bookingDate);
    const [startTime, setStartTime] = useState(booking.startTime);
    const [endTime, setEndTime] = useState(booking.endTime);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedBooking = {
                bookingDate,
                startTime,
                endTime,
            };

            await axios.put(`http://localhost:3000/bookings/${booking._id}`, updatedBooking, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            navigate('/bookings');
        } catch (error) {
            console.error('Error updating booking:', error);
            setError('Failed to update booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg text-gray-800">
            <h1 className="text-3xl font-extrabold text-green-800 mb-6 border-b-4 border-green-700 pb-2">Update Booking</h1>
            {error && <p className="text-red-600 mb-3">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">
                        Booking Date
                    </label>
                    <input
                        type="date"
                        id="bookingDate"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 p-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Booking'}
                </button>
            </form>
        </div>
    );
};

export default UpdateBooking;