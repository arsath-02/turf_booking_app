import React, { useState, useEffect } from 'react';

const TurfList = () => {
    const [turfs, setTurfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTurfs = async () => {
            try {
                const response = await fetch('http://localhost:3000/turfs');
                if (!response.ok) {
                    throw new Error('Failed to fetch turfs');
                }
                const data = await response.json();
                setTurfs(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTurfs();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Available Turfs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {turfs.map(turf => (
                    <div key={turf._id} className="border rounded-lg shadow-lg p-4">
                        <img 
                            src={`http://localhost:3000/turfs/image/${turf._id}`} 
                            alt={turf.name} 
                            className="w-full h-48 object-cover rounded-md mb-4"
                            onError={(e) => console.error('Image load error:', e)} 
                        />
                        <h2 className="text-2xl font-semibold mb-2">{turf.name}</h2>
                        <p className="text-gray-700 mb-2">{turf.location}</p>
                        <p className="text-gray-700 mb-2">City: {turf.city}</p>
                        <p className="text-gray-700 mb-2">Price: ${turf.price}</p>
                        <p className="text-gray-700 mb-2">Price per hour: ${turf.pricePerHour}</p>
                        <p className="text-gray-700 mb-2">Rating: {turf.rating}</p>
                        <p className="text-gray-700 mb-2">Contact: {turf.contactnumber}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TurfList;
