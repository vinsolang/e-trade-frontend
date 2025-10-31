// Dashboard
// import React from "react";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    FaBox,
    FaUsers,
    FaClipboardList,
    FaChartLine,
    FaDollarSign,
    FaUserCircle
    // FIX: Added the missing FaUserCircle icon
} from 'react-icons/fa';
import axios from "axios";

// --- API Endpoints ---
const PRODUCTS_API = "http://localhost:8081/api/admin/products";
const USERS_API = "http://localhost:8081/api/auth/users";
const ORDERS_API = "http://localhost:8081/api/orders"; // Assuming this is your orders endpoint
// Mock data updated to include actual calculated revenue placeholders
const INITIAL_STATS = {
    productCount: 0,
    userCount: 0,
    orderCount: 0,
    revenueYear: 0.00,
    revenueMonth: 0.00,
    revenueDay: 0.00,
};
// --- MOCK DATA FOR WEEKLY REVENUE (Mon–Sun) ---
const MOCK_WEEKLY_REVENUE = [
    { day: 'Mon', revenue: 12500 },
    { day: 'Tue', revenue: 8600 },
    { day: 'Wed', revenue: 14200 },
    { day: 'Thu', revenue: 9800 },
    { day: 'Fri', revenue: 17500 }, // High revenue day
    { day: 'Sat', revenue: 19500 }, // Peak day
    { day: 'Sun', revenue: 5200 },  // Low revenue day
];
// --- Stat Card Component for Reusability (Remains the same) ---
const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-${color}-500 transition duration-300 hover:shadow-xl`}>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{count}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);
// --- : Chart Container Component ---
const ChartCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg col-span-1">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h3>
        {/* The children prop is where your actual chart component will go */}
        <div className="h-80 flex items-center justify-center">
            {children}
        </div>
    </div>
);
// ------------------------------------------

const Dashboard = () => {
    // Determine the current path to decide whether to show the Stat Cards or the Outlet content
    const location = useLocation();

    // Check if the current path is exactly '/admin' (or wherever your dashboard index is)
    const isDashboardIndex = location.pathname === '/admin' || location.pathname === '/admin/';
    const [stats, setStats] = useState(INITIAL_STATS);
    // 2. Fetch the actual product count from the API
    const fetchStats = async () => {
        // We'll perform multiple API calls concurrently
        const productPromise = axios.get(PRODUCTS_API);
        const userPromise = axios.get(USERS_API);
        const orderPromise = axios.get(ORDERS_API); // Fetch all orders for counting/revenue calculation

        try {
            const [productsRes, usersRes, ordersRes] = await Promise.all([
                productPromise,
                userPromise,
                orderPromise,
            ]);

            // IMPORTANT CHANGE: Map over orders to ensure a 'createdAt' is present for testing
            const nowIso = new Date().toISOString(); // e.g., "2025-10-31T15:00:00.000Z"
            const allOrders = ordersRes.data.map(order => ({
                ...order,
                // If the backend is missing createdAt, mock it with the current time (for testing)
                // Remove this .map() once your backend is fixed!
                createdAt: order.createdAt || nowIso,
                // Ensure totalAmount is a number
                totalAmount: Number(order.totalAmount) || 0
            }));

            // --- Revenue Calculation (this section remains correct) ---
            const today = nowIso.slice(0, 10); // YYYY-MM-DD
            const currentMonth = nowIso.slice(0, 7); // YYYY-MM
            const currentYear = new Date().getFullYear().toString();

            const revenueToday = allOrders
                .filter(order => order.createdAt && order.createdAt.startsWith(today))
                .reduce((sum, order) => sum + order.totalAmount, 0);

            const revenueThisMonth = allOrders
                .filter(order => order.createdAt && order.createdAt.startsWith(currentMonth))
                .reduce((sum, order) => sum + order.totalAmount, 0);

            const revenueThisYear = allOrders
                .filter(order => order.createdAt && order.createdAt.startsWith(currentYear))
                .reduce((sum, order) => sum + order.totalAmount, 0);
            // ---------------------------

            setStats({
                productCount: productsRes.data.length,
                userCount: usersRes.data.length, // Assuming usersRes.data is an array of users
                orderCount: allOrders.length,
                revenueYear: revenueThisYear,
                revenueMonth: revenueThisMonth,
                revenueDay: revenueToday,
            });

        } catch (err) {
            console.error("Failed to fetch dashboard stats:", err);
            // Set counts to N/A on error
            setStats(prev => ({
                ...prev,
                productCount: 'N/A',
                userCount: 'N/A',
                orderCount: 'N/A',
                revenueYear: 'N/A',
                revenueMonth: 'N/A',
                revenueDay: 'N/A',
            }));
        }
    };

    useEffect(() => {
        if (isDashboardIndex) {
            fetchStats();
        }
    }, [isDashboardIndex]);

    const {
        productCount,
        userCount,
        orderCount,
        revenueYear,
        revenueMonth,
        revenueDay
    } = stats;

    // Helper for formatting money (handles the 'N/A' case too)
    const formatCurrency = (value) => {
        if (typeof value === 'number') {
            return `$${value.toFixed(2)}`;
        }
        return 'N/A';
    }
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-[210px] bg-gray-900 text-white flex flex-col p-5">
                <h2 className="text-xl font-bold mb-8 flex items-center">
                    <FaChartLine className="mr-2 text-blue-400" />
                    Admin Dashboard
                </h2>
                <nav className="flex flex-col gap-3">

                    {/* Dashboard Index Link */}
                    <Link
                        to="/admin" // Assuming /admin is your dashboard index
                        className="flex items-center p-2 rounded-lg hover:bg-gray-800 hover:text-blue-400 transition duration-150"
                    >
                        <FaChartLine className="mr-3 text-lg" />
                        Dashboard
                    </Link>

                    {/* Products Link */}
                    <Link
                        to="/admin/products"
                        className="flex items-center p-2 rounded-lg hover:bg-gray-800 hover:text-blue-400 transition duration-150"
                    >
                        <FaBox className="mr-3 text-lg" />
                        Products
                    </Link>

                    {/* Users Link */}
                    <Link
                        to="/admin/users"
                        className="flex items-center p-2 rounded-lg hover:bg-gray-800 hover:text-blue-400 transition duration-150"
                    >
                        <FaUsers className="mr-3 text-lg" />
                        Users
                    </Link>
                    {/* Admin Profile - Fixed the FaUserCircle reference */}
                    {/* <Link
                        to="/admin/profile"
                        className="flex items-center p-2 rounded-lg hover:bg-gray-800 hover:text-blue-400 transition duration-150"
                    >
                        <FaUserCircle className="mr-3 text-lg" />
                        Profile
                    </Link> */}
                    {/* Orders Link */}
                    <Link
                        to="/admin/orders"
                        className="flex items-center p-2 rounded-lg hover:bg-gray-800 hover:text-blue-400 transition duration-150"
                    >
                        <FaClipboardList className="mr-3 text-lg" />
                        Orders
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
                {isDashboardIndex ? (
                    <div className="space-y-8">
                        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>

                        {/* FIRST ROW: Counts */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Total Products" count={productCount} icon={FaBox} color="blue" />
                            <StatCard title="Total Users" count={userCount} icon={FaUsers} color="green" />
                            <StatCard title="Total Orders" count={orderCount} icon={FaClipboardList} color="indigo" />
                        </div>

                        <div className="w-full p-6 bg-white rounded-2xl shadow-sm">
                            {/* Section Title */}
                            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-4 mb-6">
                                Revenue Summary
                            </h2>

                            {/* Main Flex Container */}
                            <div className="flex flex-col lg:flex-row gap-8">

                                {/* LEFT SIDE: Stat Cards (3 stacked boxes) */}
                                <div className="flex flex-col gap-4 lg:w-1/3">
                                    <StatCard
                                        title="Revenue (Annual)"
                                        count={formatCurrency(revenueYear)}
                                        icon={FaDollarSign}
                                        color="pink"
                                    />
                                    <StatCard
                                        title="Revenue (Monthly)"
                                        count={formatCurrency(revenueMonth)}
                                        icon={FaDollarSign}
                                        color="pink"
                                    />
                                    <StatCard
                                        title="Revenue (Daily)"
                                        count={formatCurrency(revenueDay)}
                                        icon={FaDollarSign}
                                        color="pink"
                                    />
                                </div>

                                {/* RIGHT SIDE: Bar Chart */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                                        Weekly Revenue Trend (Mon – Sun)
                                    </h3>

                                    <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
                                        <h4 className="text-center text-sm text-gray-600 mb-2">
                                            Revenue Scale: $0 - $20,000
                                        </h4>

                                        {/* Chart Bars */}
                                        <div className="flex justify-between items-end h-64 pt-4">
                                            {MOCK_WEEKLY_REVENUE.map((data, index) => {
                                                const normalizedHeight = ((data.revenue / 20000) * 80) + 10; // Scale 0–20,000
                                                return (
                                                    <div key={index} className="flex flex-col items-center group cursor-pointer">
                                                        {/* Bar */}
                                                        <div
                                                            style={{ height: `${normalizedHeight}%` }}
                                                            className="w-10 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-700 relative"
                                                        >
                                                            {/* Tooltip */}
                                                            <span className="absolute -top-6 text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                ${data.revenue.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        {/* X-Axis Label */}
                                                        <span className="text-xs mt-1 text-gray-600 font-medium">{data.day}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <p className="text-xs text-center text-gray-400 mt-3">Days of the Week</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                ) : (
                    <Outlet />
                )}
            </div>
        </div>
    );
};

export default Dashboard;