import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import axios from 'axios';
import { FaUserEdit, FaLock } from 'react-icons/fa';

const PROFILE_API = "http://localhost:8081/api/auth/profile";
const PASSWORD_API = "http://localhost:8081/api/auth/change-password"; 

const AdminProfile = () => {
    const { user, updateContextUser } = useContext(AuthContext);
    const [email, setEmail] = useState(user?.email || "");
    const [username, setUsername] = useState(user?.username || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            // Note: You must configure Spring Boot to require a JWT or session
            // for this endpoint, and use the user's ID from the context.
            const response = await axios.put(`${PROFILE_API}/${user.id}`, { username, email }); 
            
            // Update context with new user data
            updateContextUser(response.data); 

            setMessage("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };
    
    // Function to handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            // You will need to implement a ChangePasswordRequest DTO in Spring Boot
            await axios.put(`${PASSWORD_API}/${user.id}`, { currentPassword, newPassword });

            setMessage("Password updated successfully! Please log in with your new password.");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password. Check current password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-800 border-b pb-2">Admin Profile </h1>
            
            {message && <div className="p-3 text-green-700 bg-green-100 rounded-lg">{message}</div>}
            {error && <div className="p-3 text-red-700 bg-red-100 rounded-lg">{error}</div>}

            {/* Profile Information Card */}
            <div className="bg-white p-6 rounded-xl shadow-xl space-y-6">
                <h2 className="text-2xl font-semibold flex items-center text-indigo-600">
                    <FaUserCircle className="mr-2" /> Current Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div>
                        <p className="font-medium text-sm text-gray-500">Role</p>
                        <p className="font-bold text-lg">{user?.role.toUpperCase()}</p>
                    </div>
                    <div>
                        <p className="font-medium text-sm text-gray-500">User ID</p>
                        <p className="text-sm">{user?.id}</p>
                    </div>
                </div>
            </div>

            {/* Update Profile Form */}
            <div className="bg-white p-6 rounded-xl shadow-xl">
                <h2 className="text-2xl font-semibold flex items-center mb-4 border-b pb-2 text-indigo-600">
                    <FaUserEdit className="mr-2" /> Update Details
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />

                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Save Profile"}
                    </button>
                </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white p-6 rounded-xl shadow-xl">
                <h2 className="text-2xl font-semibold flex items-center mb-4 border-b pb-2 text-red-600">
                    <FaLock className="mr-2" /> Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                        required
                    />
                    
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                        required
                    />

                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400"
                        disabled={loading}
                    >
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;