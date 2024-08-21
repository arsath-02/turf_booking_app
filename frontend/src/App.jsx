import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register/Register';
import Login from './components/auth/Login/Login';
import TurfRegister from './components/Turfregister/Turfregister';
import Success from './components/Success/Success';
import Home from './components/Home/Home';
import Profile from './components/Home/Profile';
import Turfs from './components/Turf/Turf';
import Bookings from './components/Bookings/BookingsList';
import BookingForm from './components/BookingForm/BookingForm';
import BookingDetails from './components/BookingForm/BookingsDetails';
import BookingsUpdate from './components/Bookings/BookingsUpdate';


function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/turfs/register" element={<TurfRegister />}/>
      <Route path='/success' element={<Success/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/turfs' element={<Turfs />} />
      <Route path='/bookings' element={<Bookings />} />
      <Route path='/bookings/new/:turfId' element={<BookingForm />} />
      <Route path='/bookings/details' element={<BookingDetails />} />
      <Route path='/update-booking' element={<BookingsUpdate />} />
      

    </Routes>
  );
}

export default App;
