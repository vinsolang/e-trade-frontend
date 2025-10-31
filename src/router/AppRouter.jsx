import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import ProductDetial from "../pages/ProductDetial";

// Admin pages
import Dashboard from "../pages/Admin/Dashboard";
import Products from "../pages/Admin/Products";
import Users from "../pages/Admin/Users";
import Orders from "../pages/Admin/Orders";
import About from "../pages/About";
import Contact from "../pages/Contact";

// NEW ADMIN IMPORTS ADDED HERE
// You may need to adjust the paths based on where these components are located
import AdminLogin from "../pages/Admin/AdminLogin";    // The Admin login component
import AdminRoute from "../pages/Admin/AdminRoute";    // The protection wrapper
import AdminProfile from "../pages/Admin/AdminProfile"; // The Admin profile page

const AppRouter = () => {
 return (
  <Routes>
   {/* Public routes */}
   <Route path="/login" element={<Login />} />
   <Route path="/register" element={<Register />} />
   <Route path="/" element={<Home />} />
   <Route path="/products" element={<Product />} />
   <Route path="/about" element={<About />} />
   <Route path="/contact" element={<Contact />} />
   <Route path="/cart" element={<Cart />} />
   <Route path="/products/:id" element={<ProductDetial />} />

   {/* Admin routes */}
<Route path="/admin/login" element={<AdminLogin />} />

{/* Admin Protected Routes */}
<Route path="/admin" element={<AdminRoute />}>
  <Route element={<Dashboard />}>
    <Route index element={<Dashboard />} />  {/* Dashboard homepage */}
    <Route path="products" element={<Products />} />
    <Route path="users" element={<Users />} />
    <Route path="orders" element={<Orders />} />
    <Route path="profile" element={<AdminProfile />} />
  </Route>
</Route>

<Route path="*" element={<NotFound />} />
  </Routes>
 );
};

export default AppRouter;