import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        // Show a simple loading indicator while context is initializing
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-indigo-600">
                Loading authentication...
            </div>
        );
    }

    // Check if user is logged in AND has the 'admin' role
    if (!user || user.role !== "admin") {
        // Redirect non-admin or unauthenticated users to the login page
        // The 'replace' prop ensures the unauthorized route is not added to history
        return <Navigate to="/admin/login" replace />;
    }

    // If authorized, render the child routes (Dashboard)
    return <Outlet />;
};

export default AdminRoute;