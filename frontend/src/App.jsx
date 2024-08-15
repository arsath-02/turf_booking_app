import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register/Register';
import Login from './components/auth/Login/Login';
import TurfRegister from './components/Turfregister/Turfregister';
import Success from './components/Success/Success';
import Home from './components/Home/Home';
import Profile from './components/Home/Profile';

function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/turfs" element={<TurfRegister />}/>
      <Route path='/success' element={<Success/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/profile' element={<Profile/>}/>
      
    </Routes>
  );
}

export default App;
