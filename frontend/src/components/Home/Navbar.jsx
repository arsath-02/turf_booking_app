import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiSearchLine, RiUserFill, RiMenu3Line } from 'react-icons/ri';
import { BsBookmarkHeartFill } from 'react-icons/bs';
import CitySearch from './Location'; 
import { IoLocationOutline } from "react-icons/io5";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const navigate = useNavigate();

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationSelect = (selectedLocation) => {
    setIsLocationPopupOpen(false); 
    navigate(`/location=${selectedLocation}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 md:space-x-16">
          <Link to='/' className='text-xl md:text-2xl text-white font-bold '>Turfs</Link>
        </div>

        <div className="hidden sm:flex flex-1 justify-center px-4 ">
          <input
            type='search'
            placeholder='Search for Turfs, Events'
            value={searchQuery}
            onChange={onSearchChange}
            className='px-4 py-2 md:py-3 rounded-full text-black w-full md:w-1/2'
          />
          <div className='absolute top-4  md:top-8 text-gray-500 '><RiSearchLine /></div>
        </div>
        <div >
          <Link to='/auth/login' className='text-white'>Sign In</Link>
        </div>

        <div className="flex items-center px-10 space-x-4 text-gray-800">
          <button onClick={() => setIsLocationPopupOpen(true)} className="flex items-center text-white">
          <IoLocationOutline/><span>Select Location</span>
          </button>
        </div>

        <div className="flex items-center space-x-8 ">
          <Link to='/bookings'><BsBookmarkHeartFill className='text-blue-500' /></Link>
          <Link to='/profile'><RiUserFill /></Link>
          <div className='cursor-pointer hover:text-gray-300 md:hidden' onClick={toggleSidebar}>
            <RiMenu3Line />
          </div>
        </div>
      </nav>

      {isLocationPopupOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg">
            <CitySearch onLocationSelect={handleLocationSelect} />
            <button onClick={() => setIsLocationPopupOpen(false)} className="text-red-500 mt-4">Close</button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`container mx-auto p-4 ${isSidebarOpen ? 'block' : 'hidden'} md:hidden`}>
        <ul className='flex flex-col space-y-8 '>
          <li><Link to='/home'>Home</Link></li>
          <li><Link to='/turfs'>Turfs</Link></li>
          <li><Link to='/events'>Events</Link></li>
          <li><Link to='/auth/register'>LogOut</Link></li>
          <li><Link to='/auth/login'>Sign In</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
