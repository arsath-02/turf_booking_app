import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiSearchLine, RiUserFill, RiMenu3Line } from 'react-icons/ri';
import { BsBookmarkHeartFill } from 'react-icons/bs';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 md:space-x-16">
          <Link to='/home' className='text-xl md:text-2xl text-white font-bold'>Turfs</Link>
          <div className='relative hidden md:block'>
            <input
              type='search'
              name='search'
              placeholder='Search for Turfs, Events'
              value={searchQuery}
              onChange={onSearchChange}
              className='px-4 md:px-12 py-2 md:py-3 rounded-full text-black w-96'
            />
            <div className='absolute right-3 top-3 md:top-4 text-gray-500'><RiSearchLine /></div>
          </div>
        </div>
        <div className="hidden md:flex flex-1 justify-center">
          <ul className='flex space-x-10  '>
            <li><Link to='/turfs' className='hover:text-gray-300 text-white'>Turfs</Link></li>
            <li><Link to='/events' className='hover:text-gray-300 text-white'>Events</Link></li>
          </ul>
        </div>
        <div className="flex items-center space-x-4 md:space-x-8">
          <ul className='hidden md:flex space-x-4 md:space-x-8'>
            <li className="navbar-item">
              <Link to="/auth/register" className="hover:text-white-300 text-white">LogOut</Link>
            </li>
            <li>
              <Link to="/auth/login" className='btn bg-white text-green-500 px-4 py-2 rounded-full hover:bg-gray-200'>Sign In</Link>
            </li>
          </ul>
          <div className='flex items-center space-x-4 md:space-x-10'>
            <Link to='/bookings' className='hover:text-gray-300 text-blue-500'><BsBookmarkHeartFill className='text-blue-500' /></Link>            
            <Link to='/profile' className='hover:text-gray-300 text-blue-500'><RiUserFill /></Link>
            <div className='cursor-pointer hover:text-gray-300 md:hidden' onClick={toggleSidebar}>
              <RiMenu3Line />
            </div>
          </div>
        </div>
      </nav>
      <hr className="border-gray-200" />
      <div className={`container mx-auto p-4 ${isSidebarOpen ? 'block' : 'hidden'} md:hidden`}>
        <ul className='flex flex-col space-y-8'>
          <li><Link to='/home' className='hover:text-gray-300 text-white space-y-6'>Home</Link></li>
          <li><Link to='/turfs' className='hover:text-gray-300 text-white space-y-6'>Turfs</Link></li>
          <li><Link to='/events' className='hover:text-gray-300 text-white space-y-6'>Events</Link></li>
          <li><Link to="/auth/register" className="hover:text-gray-300 text-white space-y-6">LogOut</Link></li>
          <li>
            <Link to="/auth/login" className='btn bg-white text-green-500 px-4 py-2 rounded-full hover:bg-gray-200'>Sign In</Link>
          </li>
          <li>
            <div className='relative'>
              <input
                type='search'
                name='search'
                placeholder='Search for Turfs, Events'
                value={searchQuery}
                onChange={onSearchChange}
                className='px-9 py-2 rounded-full text-black w-full'
              />
              <div className='absolute left-4 top-4 justify-center items-center text-blue-500'>
                <RiSearchLine />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
