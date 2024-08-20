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
  const [editMode, setEditMode] = useState(false); // State for edit mode

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
      setEditMode(false); // Exit edit mode after successful update
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
      await axios.put('http://localhost:3000/profile/change-password', {
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
    return <div className="text-center text-green-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="text-center text-gray-600">No user data available.</div>;
  }

  const { firstname, lastname, email, phonenumber, role, bookings } = userData;

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-green-800 mb-6 border-b-4 border-green-700 pb-2">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Toggle Edit Mode Button */}
        {!editMode ? (
          <button 
            onClick={() => setEditMode(true)} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mb-4"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex justify-center items-center bg-gray-100 min-h-screen">
            <div className="bg-white p-10 rounded-md w-full max-w-md">
              <h2 className="text-2xl font-semibold text-center text-green-600 mb-3">Update Profile</h2>
              {updateSuccess && <div className="text-green-600 mb-4">{updateSuccess}</div>}
              {updateError && <div className="text-red-600 mb-4">{updateError}</div>}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="mb-2">
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstname"
                    value={updateData.firstname}
                    onChange={(e) => setUpdateData({ ...updateData, firstname: e.target.value })}
                    required
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastname"
                    value={updateData.lastname}
                    onChange={(e) => setUpdateData({ ...updateData, lastname: e.target.value })}
                    required
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    id="phonenumber"
                    value={updateData.phonenumber}
                    onChange={(e) => setUpdateData({ ...updateData, phonenumber: e.target.value })}
                    required
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full mt-4 p-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
              <h2 className="text-2xl font-semibold text-center text-green-600 mt-6 mb-3">Change Password</h2>
              {passwordSuccess && <div className="text-green-600 mb-4">{passwordSuccess}</div>}
              {passwordError && <div className="text-red-600 mb-4">{passwordError}</div>}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="mb-2">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                    required
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full mt-4 p-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Display Profile Information */}
        {!editMode && (
          <div>
            <div className="mb-4 text-gray-800">
              <strong className="text-green-700">First Name:</strong> {firstname}
            </div>
            <div className="mb-4 text-gray-800">
              <strong className="text-green-700">Last Name:</strong> {lastname}
            </div>
            <div className="mb-4 text-gray-800">
              <strong className="text-green-700">Email:</strong> {email}
            </div>
            <div className="mb-4 text-gray-800">
              <strong className="text-green-700">Phone Number:</strong> {phonenumber}
            </div>
            <div className="mb-4 text-gray-800">
              <strong className="text-green-700">Role:</strong> {role}
            </div>
            {role !== 'admin' && (
              <div className="mb-4 text-gray-800">
                <strong className="text-green-700">Bookings:</strong>
                <ul className="space-y-4 mt-2">
                  {bookings && bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                      <li key={index} className="p-4 bg-green-50 rounded-lg border border-green-200 text-gray-800">
                        <div><strong className="text-green-700">Turf Name:</strong> {booking.turfId?.name || 'N/A'}</div>
                        <div><strong className="text-green-700">Location:</strong> {booking.turfId?.location || 'N/A'}</div>
                        <div><strong className="text-green-700">Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</div>
                        <div><strong className="text-green-700">Start Time:</strong> {booking.startTime}</div>
                        <div><strong className="text-green-700">End Time:</strong> {booking.endTime}</div>
                        <div><strong className="text-green-700">Total Amount:</strong> ${booking.totalAmount}</div>
                        <div><strong className="text-green-700">Payment Status:</strong> {booking.paymentStatus}</div>
                      </li>
                    ))
                  ) : (
                    <li>No bookings available.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
