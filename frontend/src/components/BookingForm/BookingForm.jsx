import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BookingForm = () => {
    const { turfId } = useParams(); // Extract turfId from the URL
    const [turfs, setTurfs] = useState([]);
    const [selectedTurf, setSelectedTurf] = useState(turfId || ''); 
    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTurfs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/turfs');
                setTurfs(response.data.data);
            } catch (error) {
                console.error('Error fetching turfs:', error);
                setError('Failed to load turfs.');
            }
        };

        fetchTurfs();
    }, []);

    useEffect(() => {
        if (turfId) {
            setSelectedTurf(turfId);
        }
    }, [turfId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const bookingData = {
                turfId: selectedTurf,
                bookingDate,
                startTime,
                endTime,
                totalAmount,
            };

            const response = await axios.post('http://localhost:3000/bookings', bookingData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            navigate('/bookings/details', { state: { booking: response.data } });
        } catch (error) {
            console.error('Error creating booking:', error);
            setError('Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTimeChange = (start, end) => {
        setStartTime(start);
        setEndTime(end);
        const selectedTurfDetails = turfs.find(turf => turf._id === selectedTurf);
        if (selectedTurfDetails) {
            const durationInHours = (new Date(`1970-01-01T${end}`).getTime() - new Date(`1970-01-01T${start}`).getTime()) / (1000 * 60 * 60);
            setTotalAmount(durationInHours * selectedTurfDetails.pricePerHour);
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Booking your slot...</div>;
    }

    return (
        <div className="flex justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-md w-full max-w-md">
                <h1 className="text-3xl font-semibold text-center text-green-600 mb-3">Book a Turf</h1>
                {error && <p className="text-red-600 mb-3">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="turf" className="block text-sm font-medium text-gray-700">
                            Select Turf
                        </label>
                        <select
                            id="turf"
                            value={selectedTurf}
                            onChange={(e) => setSelectedTurf(e.target.value)}
                            className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            required
                        >
                            <option value="">Select a Turf</option>
                            {turfs.map((turf) => (
                                <option key={turf._id} value={turf._id}>
                                    {turf.name} - {turf.city}
                                </option>
                            ))}
                        </select>
                    </div>

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
                            onChange={(e) => handleTimeChange(e.target.value, endTime)}
                            className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => handleTimeChange(startTime, e.target.value)}
                            className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                            Total Amount
                        </label>
                        <input
                            type="text"
                            id="totalAmount"
                            value={`$${totalAmount.toFixed(2)}`}
                            readOnly
                            className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
