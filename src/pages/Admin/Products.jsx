import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminProductForm from "../../components/AdminProductForm";
import Swal from 'sweetalert2';
import { FaEdit, FaPlus, FaTrashAlt, FaSyncAlt } from 'react-icons/fa';

const API = "https://e-trade-project-production.up.railway.app/api/admin/products";
// const imageBase = "http://localhost:8081/images/products";
const imageBase = "https://e-trade-project-production.up.railway.app";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API);
      setAllProducts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    // 1. Show a beautiful confirmation modal
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Red color for delete
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    // If the user didn't confirm, stop.
    if (!result.isConfirmed) {
      return;
    }

    try {
      // 2. Perform the delete operation
      await axios.delete(`${API}/${id}`);
      setAllProducts(prev => prev.filter(p => p.id !== id));

      // 3. Show a beautiful success alert
      Swal.fire(
        'Deleted!',
        'Your product has been deleted successfully.',
        'success'
      );
    } catch (err) {
      console.error(err);

      // 4. Show a beautiful error alert
      Swal.fire(
        'Failed!',
        'There was an error deleting the product.',
        'error'
      );
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleCreateClick = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleFormSaved = (savedProduct) => {
    setAllProducts(prev => {
      const exists = prev.some(p => p.id === savedProduct.id);
      if (exists) return prev.map(p => p.id === savedProduct.id ? savedProduct : p);
      return [savedProduct, ...prev];
    });
    setShowFormModal(false);
    setEditingProduct(null);
  };

  // Helper function to format category slug (e.g., 'smart_home_devices' -> 'Smart Home Devices')
  const formatCategory = (slug) => {
    if (!slug) return 'N/A';
    return slug
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="relative left-[-10x]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <div>
          {/* The new flex container for the buttons */}
          <div className="flex justify-start items-center space-x-3">

            {/* 1. Add Product Button */}
            <button
              onClick={handleCreateClick}
              className="
        px-4 py-2 
        bg-green-600 hover:bg-green-700
        text-white font-semibold 
        rounded-lg shadow-md hover:shadow-lg 
        transform hover:scale-105 transition duration-300 ease-in-out 
        flex items-center 
      "
            >
              <FaPlus className="mr-1.5" /> {/* Add Icon */}
              Add Product
            </button>

            {/* 2. Refresh Button */}
            <button
              onClick={fetchProducts}
              className="
        px-4 py-2 
        bg-gray-400 hover:bg-gray-500
        text-white font-semibold 
        rounded-lg shadow-md hover:shadow-lg 
        transform hover:scale-105 transition duration-300 ease-in-out 
        flex items-center 
      "
            >
              <FaSyncAlt className="mr-1.5" /> {/* Refresh Icon */}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          {/* Responsive Scroll Wrapper */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">

              {/* Table Header */}
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Image</th>
                  <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Category</th>
                  <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Stock</th>
                  <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Current Price</th>
                  <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Old Price</th>
                  <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Discount</th>
                  <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Color</th>
                  <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {allProducts?.map((product) => {
                  let imgs = [];
                  try { imgs = JSON.parse(product.images || "[]"); } catch (e) { }

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-indigo-50 transition duration-150 ease-in-out"
                    >
                      {/* Image */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {imgs[0] ? (
                          <img
                            src={`${imageBase}${imgs[0]}`}
                            alt={product.name}
                            className="w-12 h-12 object-contain rounded-md shadow-sm border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded-md border">
                            No Img
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800 max-w-[160px] truncate">
                        {product.name}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatCategory(product.category)}
                      </td>

                      {/* Stock Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`
                    px-2.5 py-1 inline-flex text-[11px] leading-5 font-semibold rounded-full
                    ${product.stockStatus === 'in_stock' ? 'bg-green-100 text-green-800' :
                              product.stockStatus === 'preorder' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}
                  `}
                        >
                          {formatCategory(product.stockStatus)}
                        </span>
                      </td>

                      {/* Prices */}
                      <td className="px-4 py-3 text-sm font-bold text-indigo-600 whitespace-nowrap">
                        ${product.currentPrice?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 line-through whitespace-nowrap">
                        ${product.oldPrice?.toFixed(2)}
                      </td>

                      {/* Discount */}
                      <td className="px-4 py-3 text-sm font-bold text-red-500 whitespace-nowrap">
                        {product.discountPercent}%
                      </td>

                      {/* Color */}
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {product.color}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow hover:shadow-md transform hover:scale-105 transition duration-200 flex items-center"
                          >
                            <FaEdit className="mr-1.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow hover:shadow-md transform hover:scale-105 transition duration-200 flex items-center"
                          >
                            <FaTrashAlt className="mr-1.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View: No Data Message */}
          {(!allProducts || allProducts.length === 0) && (
            <div className="text-center py-6 text-gray-500 text-sm">No products found.</div>
          )}
        </div>

      )}

      {/* Modal Form */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowFormModal(false)}
            >
              ✕
            </button>
            <AdminProductForm
              product={editingProduct}
              onCancel={() => setShowFormModal(false)}
              onSaved={handleFormSaved}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;