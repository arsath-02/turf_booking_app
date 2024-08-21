import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingsList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:3000/bookings', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setBookings(response.data.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setError('Failed to load bookings.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleUpdate = (bookingData) => {
        try {
            navigate('/update-booking', { state: { booking: bookingData } });
        } catch (error) {
            console.error('Error navigating to update booking:', error);
            setError('Failed to navigate to update booking. Please try again.');
        }
    };

    const handleCancel = async (bookingId) => {
        try {
            await axios.delete(`http://localhost:3000/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setBookings(bookings.filter(booking => booking._id !== bookingId));
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setError('Failed to cancel booking. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading bookings...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg text-gray-800">
            <h1 className="text-3xl font-extrabold text-green-800 mb-6 border-b-4 border-green-700 pb-2">Your Bookings</h1>
            {bookings.length === 0 ? (
                <div className="text-center mt-10">No bookings found.</div>
            ) : (
                bookings.map((bookingData) => (
                    <div key={bookingData._id} className="bg-white shadow-md rounded-lg p-6 mb-4">
                        <div><strong className="text-green-700">Booking ID:</strong> {bookingData._id}</div>
                        <div><strong className="text-green-700">Turf Name:</strong> {bookingData.turfId?.name || 'N/A'}</div>
                        <div><strong className="text-green-700">Location:</strong> {bookingData.turfId?.location || 'N/A'}</div>
                        <div><strong className="text-green-700">Booking Date:</strong> {new Date(bookingData.bookingDate).toLocaleDateString()}</div>
                        <div><strong className="text-green-700">Start Time:</strong> {bookingData.startTime}</div>
                        <div><strong className="text-green-700">End Time:</strong> {bookingData.endTime}</div>
                        <div><strong className="text-green-700">Total Amount:</strong> ${bookingData.totalAmount}</div>
                        <div><strong className="text-green-700">Payment Status:</strong> {bookingData.paymentStatus}</div>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => handleUpdate(bookingData)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleCancel(bookingData._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default BookingsList;