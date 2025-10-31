import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from 'react-icons/fa';
import Swal from "sweetalert2";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper: get comma-separated product names
  const getProductNames = (order) => {
    if (!order.orderItems || order.orderItems.length === 0) return "-";
    return order.orderItems.map((item) => item.name).join(", ");
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8081/api/orders/${id}`);
        // Remove from local state so UI updates
        setOrders(orders.filter(order => order.id !== id));

        Swal.fire(
          "Deleted!",
          "The order has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Failed to delete order:", error);
        Swal.fire(
          "Error",
          "Failed to delete the order.",
          "error"
        );
      }
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Manage Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-300 shadow-xl rounded-lg overflow-hidden">
          {/* Table Header */}
          <thead className="bg-gradient-to-r from-gray-700 to-gray-900 text-white border-b-4 border-indigo-500">
            <tr>
              <th className="p-3 text-left tracking-wider font-semibold">ID</th>
              <th className="p-3 text-left tracking-wider font-semibold">CusName</th>
              <th className="p-3 text-left tracking-wider font-semibold">Email</th>
              <th className="p-3 text-left tracking-wider font-semibold hidden sm:table-cell">Address</th>
              <th className="p-3 text-left tracking-wider font-semibold hidden md:table-cell">Items</th>
              <th className="p-3 text-left tracking-wider font-semibold">Amount</th>
              <th className="p-3 text-left tracking-wider font-semibold hidden sm:table-cell">Date</th>
              <th className="p-3 text-center tracking-wider font-semibold">Action</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500 italic">No orders found.</td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id} className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100 transition duration-150' : 'bg-white hover:bg-gray-100 transition duration-150'}>
                  <td className="p-3 font-medium text-gray-900">{order.id}</td>
                  <td className="p-3 text-gray-700">{order.customerName}</td>
                  <td className="p-3 text-blue-600 hover:text-blue-800 transition duration-150">{order.customerEmail}</td>
                  <td className="p-3 text-gray-600 hidden sm:table-cell">{order.customerAddress}</td>
                  <td className="p-3 text-gray-600 hidden md:table-cell">{getProductNames(order)}</td>
                  <td className="p-3 font-bold text-green-600">${order.totalAmount}</td>
                  <td className="p-3 text-gray-500 hidden sm:table-cell">{new Date().toLocaleDateString('en-US')}</td>
                  
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-500 hover:text-red-700 font-medium flex items-center p-1 rounded-md transition duration-150"
                      >
                        {/* Ensure FaTrashAlt is imported */}
                        <FaTrashAlt className="mr-1 h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
