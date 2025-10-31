import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate, Navigate } from "react-router-dom";


const AdminLogin = () => {
    const { user, login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    // If already logged in and is admin, redirect to dashboard
    if (user && user.role === "admin") {
        return <Navigate to="/admin" replace />;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await login(username.trim(), password);
            if (res.user.role !== "admin") {
                setError("You do not have admin permissions.");
                setLoading(false);
                return;
            }
            navigate("/admin");
        } catch (err) {
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow-md rounded p-6"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>


                {error && (
                    <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">{error}</div>
                )}


                <label className="block mb-2 text-sm font-medium">Your Email</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-3"
                    placeholder=""
                    required
                />


                <label className="block mb-2 text-sm font-medium">Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="w-full border px-3 py-2 rounded mb-4"
                    placeholder="......"
                    required
                />


                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>


                {/* <p className="mt-4 text-xs text-gray-500 text-center">
Demo admin credentials: <strong>admin / admin123</strong>
</p> */}
            </form>
        </div>
    );
};


export default AdminLogin;

