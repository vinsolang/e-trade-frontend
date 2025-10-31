import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const API_URL = "https://e-trade-project-production.up.railway.app/api/auth";

const useAuth = () => {
    const [authError, setAuthError] = useState(null);
    const [loading, setLoading] = useState(false);

    const register = async (formData) => {
        setLoading(true);
        setAuthError(null);
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");
            setLoading(false);
            return data;
        } catch (err) {
            setAuthError(err.message);
            setLoading(false);
            throw err;
        }
    };

    return { register, error: authError, loading };
};

const LinkPlaceholder = ({ to, children, className }) => {
    const handleClick = () => console.log(`Navigating to: ${to}`);
    return (
        <a
            href="#"
            onClick={handleClick}
            className={`text-blue-600 hover:text-blue-700 underline font-medium transition duration-150 ${className}`}
        >
            {children}
        </a>
    );
};

const Register = () => {
    const { register, error: authError, loading } = useAuth();
    const [formError, setFormError] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer",
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        const { username, email, password, confirmPassword } = formData;
        if (!username || !email || !password || !confirmPassword) {
            setFormError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }

        try {
            const result = await register(formData);
            console.log("Registered user:", result);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            console.error(err);
        }
    };

    const currentError = formError || authError;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border border-gray-100 transition duration-300 hover:shadow-3xl">
                <div className="text-center mb-8">
                    {/* <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Create Account
                    </h1> */}
                    <p className="mt-2 text-gray-500 text-lg">
                        Get started with a free account today
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {currentError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center shadow-sm">
                            {currentError}
                        </div>
                    )}

                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={loading}
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-bold tracking-wide mt-6 transition duration-300 ${loading
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 text-sm">
                    Already have an account?{" "}
                    {/* <LinkPlaceholder to={"/login"}>Sign in here</LinkPlaceholder> */}
                    <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
