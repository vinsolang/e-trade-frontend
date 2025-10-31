// This Cart Provider
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
// Removed: import { ProductContext } from "./ProductProvider"; 

export const CartContext = createContext();

const API = "http://localhost:8081/api/admin/products"; // Main Product API endpoint
const CARTS_API = "http://localhost:8081/api/carts"; // JSON Server Cart API endpoint
const imageBase = "http://localhost:8081"; // Added imageBase constant

const CartProvider = ({ children }) => {
  // ... (State variables remain the same)
  const [carts, setCarts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("id") || "guest_user"; // Same as backend expects
      const response = await fetch(`${CARTS_API}/${userId}`); //  FIX: include userId
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      setCarts(data);

      // Calculate totals
      const itemsCount = data.reduce((acc, item) => acc + item.quantity, 0);
      const total = data.reduce((acc, item) => {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 0);
        const discount = Number(item.discount || 0);
        const currentPrice = price * quantity;
        const discountAmount = (currentPrice * discount) / 100;
        return acc + (currentPrice - discountAmount);
      }, 0);

      setTotalItems(itemsCount);
      setTotalPrice(parseFloat(total.toFixed(2)));
      setTotalAmount(parseFloat(total.toFixed(2)));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };


  const userId = localStorage.getItem("id") || "guest_user";

  //  FIX 1: Add to Cart logic update for ID handling and image URL
  const addToCart = async (productId, qty) => {
    try {
      const existingCartItem = carts.find((item) => item.productId == productId);

      if (existingCartItem) {
        // Update existing quantity
        const newQuantity = existingCartItem.quantity + qty;
        const patchRes = await fetch(`${CARTS_API}/${existingCartItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        });

        if (!patchRes.ok) throw new Error("Failed to update existing cart item");
      } else {
        // Fetch product detail
        const productRes = await axios.get(`${API}/${productId}`);
        const data = productRes.data;

        // Ensure images is parsed correctly
        let imagePath = "";
        try {
          const parsed = JSON.parse(data.images);
          imagePath = Array.isArray(parsed) ? parsed[0] : parsed;
        } catch {
          imagePath = data.images; // fallback if already a string
        }

        const productToAdd = {
          productId: data.id,
          name: data.name,
          price: data.currentPrice,
          discount: data.discountPercent || 0,
          images: imagePath,
          quantity: qty,
          userId,
        };

        const postRes = await fetch(CARTS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productToAdd),
        });

        if (!postRes.ok) {
          throw new Error(`Failed to add product to cart. Status: ${postRes.status}`);
        }
      }

      await fetchCartItems();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(`Failed to add product to cart. ${error.message}`);
    }
  };


  //  FIX 3: Removal uses the cart item's ID directly.
  // This assumes 'id' passed here is the JSON Server-assigned ID from the 'carts' state.
  const removeCartItem = async (cartItemId) => { // Renamed 'id' to 'cartItemId'
    const numericId = Number(cartItemId);
    try {
      await fetch(`${CARTS_API}/${numericId}`, { method: "DELETE" });
      fetchCartItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // The updateCartItem function already correctly uses the ID to PATCH
  const updateCartItem = async (cartItemId, quantity) => {
    const cartItem = carts.find((item) => item.id == cartItemId);
    // ... (rest of updateCartItem logic is okay)
    if (!cartItem) {
      console.error("Cart item not found for update:", cartItemId);
      return;
    }
    try {
      const response = await fetch(`${CARTS_API}/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) { // This part is correct, but let's ensure it catches server errors
        throw new Error("Failed to update cart item");
      }
      fetchCartItems();
    } catch (error) {
      console.error("Error updating item:", error); // Use a more descriptive log
    }
  };

  // ... (useEffect and return statement remain the same)

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <>
      <CartContext.Provider
        value={{
          carts,
          totalItems,
          totalPrice,
          totalAmount,
          removeCartItem,
          updateCartItem,
          addToCart
        }}
      >
        {children}
      </CartContext.Provider>
    </>
  );
};

export default CartProvider;



















// import React, { createContext, useContext, useEffect, useState } from "react";
// import { ProductContext } from "./ProductProvider";

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const { allProducts } = useContext(ProductContext);
//   // const [carts, setCarts] = useState(null);
//   const [carts, setCarts] = useState([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);

//   const fetchCartItems = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/carts`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch cart items");
//       }
//       const data = await response.json();
//       setCarts(data);
//       setTotalItems(data.reduce((acc, item) => acc + item.quantity, 0));
//       setTotalPrice(
//         data.reduce(
//           (acc, item) =>
//             acc +
//             (item.price * item.quantity -
//               (item.price * item.quantity * item.discount) / 100),
//           0
//         )
//       );
//       setTotalAmount(
//         data.reduce(
//           (acc, item) =>
//             acc +
//             (item.price * item.quantity -
//               (item.price * item.quantity * item.discount) / 100),
//           0
//         )
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const userId = localStorage.getItem("id");
//   const addToCart = async (id, qty) => {
//     const resChecking = await fetch(`http://localhost:3000/carts/${id}`);
//     if (resChecking.ok) {
//       const data = await resChecking.json();
//       const newProductData = { ...data, quantity: data.quantity + qty };

//       await fetch(`http://localhost:3000/carts/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newProductData),
//       });
//       fetchCartItems();
//     } else {
//       // add to cart
//       const productToAdd = allProducts.find((pro) => pro.id == id);

//       await fetch(`http://localhost:3000/carts`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...productToAdd,
//           images: productToAdd.images[0],
//           quantity: qty,
//           userId
//         }),
//       });
//       fetchCartItems();
//     }
//   };

// const removeCartItem = async (id) => {
//   const numericId = Number(id);
//   await fetch(`http://localhost:3000/carts/${numericId}`, { method: "DELETE" });
//   fetchCartItems();
// };

//   const updateCartItem = async (id, quantity) => {
//    const cartItem = carts.find((item) => item.id == id); // double equals to allow type coercion
//     if (!cartItem) {
//       throw new Error("Cart item not found");
//     }
//     try {
//       const response = await fetch(`http://localhost:3000/carts/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...cartItem,
//           quantity,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update cart item");
//       }
//       fetchCartItems();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   return (
//     <>
//       <CartContext.Provider
//         value={{
//           carts,
//           totalItems,
//           totalPrice,
//           totalAmount,
//           removeCartItem,
//           updateCartItem,
//           addToCart
//         }}
//       >
//         {children}
//       </CartContext.Provider>
//     </>
//   );
// };

// export default CartProvider;
