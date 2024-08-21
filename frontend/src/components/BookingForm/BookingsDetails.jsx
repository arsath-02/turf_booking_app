import React from 'react';
import { useLocation } from 'react-router-dom';

const BookingDetails = () => {
    const location = useLocation();
    const { booking } = location.state || {};

    if (!booking) {
        return <div className="text-center mt-10">No booking details available.</div>;
    }

    return (
        <div className="flex justify-center bg-gray-100 text-gray-600">
            <div className="bg-white p-10 rounded-md w-full max-w-md">
                <h1 className="text-3xl font-semibold text-center text-green-600 mb-3">Booking Details</h1>
                <div className="mb-4">
                    <p><strong>Turf:</strong> {booking.turfName}</p>
                    <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
                    <p><strong>Start Time:</strong> {booking.startTime}</p>
                    <p><strong>End Time:</strong> {booking.endTime}</p>
                    <p><strong>Total Amount:</strong> ${booking.totalAmount}</p>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;