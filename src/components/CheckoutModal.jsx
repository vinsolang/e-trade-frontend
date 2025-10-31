import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartProvider';
import { FaTimes, FaSpinner, FaShoppingCart } from 'react-icons/fa';
import SweetAlert from '../components/loadSweetAlert'; // Import the SweetAlert utility
// loadSweetAlert.jsx
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';


// const MySwal = withReactContent(Swal);
// NOTE: Update this URL to match your Spring Boot API endpoint if it changes
const ORDER_API = "http://localhost:8081/api/orders";
// const API = "http://localhost:8081/api/admin/products";
const imageBase = "http://localhost:8081";

const CheckoutModal = ({ isOpen, onClose, carts, totalAmount }) => {
    // NOTE: CartContext is assumed to be defined in '../context/CartProvider'
    // You will need to ensure CartProvider exports 'clearCart'
    const { clearCart } = useContext(CartContext);
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState(null);


    if (!isOpen) return null;

    const handleChange = (e) => {
        setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    };

    const formatCurrency = (amount) => parseFloat(amount).toFixed(2);

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare the order payload, flattened to match the Spring Boot Order.java entity fields
        const orderPayload = {
            // Flattened details to match Spring Boot's Order.java
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerAddress: customerInfo.address,
            totalAmount: totalAmount,

            // Map cart items to OrderItem structure
            orderItems: carts.map(cart => ({
                productId: cart.id,
                name: cart.name,
                price: parseFloat(cart.price),
                quantity: parseInt(cart.quantity, 10),
            })),
        };

        try {
            await axios.post(ORDER_API, orderPayload);

            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Order Placed!',
                text: 'Your order has been successfully submitted. Thank you for shopping with us! Contact You Soon',
                confirmButtonColor: '#3085d6',
            });

            // Clear cart
            if (clearCart) clearCart();
            onClose();
        } catch (error) {
            console.error("Order submission failed:", error.response?.data || error.message);
            setAlertConfig({
                icon: 'error',
                title: 'Order Failed',
                text: error.response?.data?.message || 'Check server logs for details',
            });
        } finally {
            setLoading(false);
        }

    };

    // Calculate item total for display in review
    const getItemTotal = (price, qty) => (price * qty).toFixed(2);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all border border-gray-200">
                <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaShoppingCart className="text-blue-600" /> Complete Your Order
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition"><FaTimes size={20} /></button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-6">
                    {/* Customer Information Form */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Shipping Details</h4>
                        <form onSubmit={handleSubmitOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input required type="text" name="name" value={customerInfo.name} onChange={handleChange}
                                    className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder=""
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input required type="email" name="email" value={customerInfo.email} onChange={handleChange}
                                    className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder=""
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                                <textarea required name="address" value={customerInfo.address} onChange={handleChange} rows="3"
                                    className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="street, sangkat, kan, PP Or Province"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || carts.length === 0}
                                className="w-full h-11 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center shadow-lg"
                            >
                                {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Confirm & Place Order'}
                            </button>
                        </form>
                    </div>
                    {/* Order Review Section */}
                    <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                        <h4 className="text-xl font-semibold text-gray-700 mb-3 border-b border-blue-200 pb-2">Review Items ({carts.length})</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {carts.map(cart => (
                                <div key={cart.id} className="flex justify-between items-start text-sm border-b border-blue-100 pb-3">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={cart.images ? `${imageBase}${cart.images}` : "https://placehold.co/50x50/3b82f6/ffffff?text=IMG"}
                                            alt={cart.name}
                                            className="w-12 h-12 object-cover rounded-md shadow-sm"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/50x50/3b82f6/ffffff?text=IMG" }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800 line-clamp-1">{cart.name}</span>
                                            {/* Assuming category exists on the cart item */}
                                            {/* <span className="text-gray-500 text-xs">Category: {cart.category || 'N/A'}</span> */}
                                        </div>
                                    </div>
                                     <div className="text-right flex flex-col items-end">
                                        <span className="block text-gray-600 text-xs">
                                           x{cart.quantity}
                                        </span>
                                    </div>
                                    {/* <div className="text-right flex flex-col items-end">
                                        <span className="block text-gray-600 text-xs">
                                            {cart.quantity} x {formatCurrency(cart.current_price)}
                                        </span>
                                        <span className="font-semibold text-base text-gray-900 line-through text-gray-400">
                                            {formatCurrency(getItemTotal(cart.oldPrice || cart.current_price, cart.quantity))}
                                        </span>
                                    </div> */}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-blue-200">
                            <div className="flex justify-between font-bold text-xl text-gray-900">
                                <span>Grand Total</span>
                                <span>${formatCurrency(totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Renders the success/error alert if alertConfig is set */}
            {/* {alertConfig && <SweetAlert config={alertConfig} onConfirm={() => setAlertConfig(null)} />} */}
        </div>
    );
};

export default CheckoutModal;
