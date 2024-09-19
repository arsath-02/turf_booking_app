import React, { useState, useEffect } from 'react';
import { IoLocationOutline } from 'react-icons/io5';

const CitySearch = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [curLocation, setCurLocation] = useState({ city: null, lat: null, lon: null });
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    getCurLocation();
  }, []);

  const getCurLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          await fetchCityFromLatLon(lat, lon);
        },
        () => {
          setLocationError("Location permission denied or unavailable.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const fetchCityFromLatLon = async (lat, lon) => {
    try {
      const apiKey = '02e0698ed6c84c87ab63df191443a650'; 
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`);
      const data = await response.json();
      const city = data.results[0]?.components?.city || data.results[0]?.components?.town || 'Unknown';
      setCurLocation({ city, lat, lon });
      onLocationSelect(city);
    } catch (error) {
      console.error('Error fetching city:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCitySelect = (city) => {
    setCurLocation((prev) => ({ ...prev, city }));
    onLocationSelect(city);
  };

  const popularCities = [
    'Mumbai', 'Delhi-NCR', 'Bengaluru', 'Hyderabad', 'Chandigarh', 'Ahmedabad', 'Pune', 'Chennai', 'Kolkata', 'Kochi'
  ];

  return (
    <div>
      <input
        type="text"
        className="border rounded-lg p-3 w-full text-gray-800"
        placeholder="Search for your city"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button onClick={getCurLocation} className="flex items-center text-red-500 mt-2">
        <IoLocationOutline className="text-xl" /> Detect my location
      </button>

      {locationError ? (
        <p className="text-red-500 mt-2">{locationError}</p>
      ) : curLocation.city ? (
        <p className="text-green-500 mt-2">You are in {curLocation.city}</p>
      ) : (
        <p className="mt-2">Detecting your location...</p>
      )}

      <div className="mt-4">
        <h3 className="text-gray-600 mb-4">Popular Cities</h3>
        <div className="grid grid-cols-2 gap-2 text-gray-800">
          {popularCities.map((city) => (
            <button
              key={city}
              className="p-2 border rounded-lg hover:bg-gray-200"
              onClick={() => handleCitySelect(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySearch;
