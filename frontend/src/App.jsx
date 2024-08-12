import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register/Register';
import Login from './components/auth/Login/Login';
import TurfRegister from './components/Turfbooking/Turfbooking';
import Success from './components/Success/Success';


function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/turfs" element={<TurfRegister />}/>
      <Route path='/success' element={<Success/>}/>
      
    </Routes>
  );
}

export default App;
