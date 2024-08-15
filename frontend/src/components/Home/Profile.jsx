import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const [updateData, setUpdateData] = useState({
    firstname: '',
    lastname: '',
    phonenumber: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data.data);
        setUpdateData({
          firstname: response.data.data.firstname,
          lastname: response.data.data.lastname,
          phonenumber: response.data.data.phonenumber
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await axios.put('http://localhost:3000/profile', updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUpdateSuccess('Profile updated successfully!');
      setUserData(response.data.data);
      setUpdateError(null);
    } catch (err) {
      setUpdateError(err.message);
      setUpdateSuccess(null);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put('http://localhost:3000/profile/change-password', {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmNewPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPasswordSuccess('Password changed successfully!');
      setPasswordError(null);
    } catch (err) {
      setPasswordError(err.message);
      setPasswordSuccess(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  const { firstname, lastname, email, phonenumber, role, bookings } = userData;

  return (
    <div className="container mx-auto p-4 text-gray-600">
      <h1 className="text-2xl font-bold mb-4 text-gray-600">Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 text-gray-600">
        <div className="mb-4 text-gray-600">
          <strong>First Name:</strong> {firstname}
        </div>
        <div className="mb-4 text-gray-600">
          <strong>Last Name:</strong> {lastname}
        </div>
        <div className="mb-4 text-gray-600">
          <strong>Email:</strong> {email}
        </div>
        <div className="mb-4 text-gray-600">
          <strong>Phone Number:</strong> {phonenumber}
        </div>
        <div className="mb-4 text-gray-600">
          <strong>Role:</strong> {role}
        </div>
        {role !== 'admin' && (
          <div className="mb-4 text-gray-600">
            <strong>Bookings:</strong>
            <ul>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <li key={index} className="p-2 bg-gray-100 rounded-lg mb-2 text-gray-600">
                    <div><strong>Turf Name:</strong> {booking.turfId?.name || 'N/A'}</div>
                    <div><strong>Location:</strong> {booking.turfId?.location || 'N/A'}</div>
                    <div><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</div>
                    <div><strong>Start Time:</strong> {booking.startTime}</div>
                    <div><strong>End Time:</strong> {booking.endTime}</div>
                    <div><strong>Total Amount:</strong> ${booking.totalAmount}</div>
                    <div><strong>Payment Status:</strong> {booking.paymentStatus}</div>
                  </li>
                ))
              ) : (
                <li>No bookings available.</li>
              )}
            </ul>
          </div>
        )}

        {/* Update Profile Form */}
        <h2 className="text-xl font-bold mt-6 text-gray-600">Update Profile</h2>
        {updateSuccess && <div className="text-green-600 mb-4">{updateSuccess}</div>}
        {updateError && <div className="text-red-600 mb-4">{updateError}</div>}
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label className="block text-gray-600">First Name</label>
            <input
              type="text"
              value={updateData.firstname}
              onChange={(e) => setUpdateData({ ...updateData, firstname: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Last Name</label>
            <input
              type="text"
              value={updateData.lastname}
              onChange={(e) => setUpdateData({ ...updateData, lastname: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Phone Number</label>
            <input
              type="text"
              value={updateData.phonenumber}
              onChange={(e) => setUpdateData({ ...updateData, phonenumber: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Profile</button>
        </form>

        {/* Change Password Form */}
        <h2 className="text-xl font-bold mt-6 text-gray-600">Change Password</h2>
        {passwordSuccess && <div className="text-green-600 mb-4">{passwordSuccess}</div>}
        {passwordError && <div className="text-red-600 mb-4">{passwordError}</div>}
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-gray-600">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;