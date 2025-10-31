
// src/components/CartListProduct.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartProvider";

// Define the image base URL used in ProductDetail and CartProvider
const imageBase = "http://localhost:8081";

const CartListProduct = ({ cart }) => {
  const { removeCartItem, updateCartItem } = useContext(CartContext);

  //  FIX 1: Add a safeguard/early return for undefined cart object
  if (!cart || !cart.price) {
    return null; // Or render a loading state if you prefer
  }

  // Ensure properties are treated as numbers for calculation
  const price = Number(cart.price) || 0;
  const discount = Number(cart.discount) || 0;
  const quantity = Number(cart.quantity) || 1;

  const discountedPrice = price - (price * discount) / 100;

  return (
    <div className="p-6">
      <div className="flex gap-4">
        {/*  FIX 2: Prepend imageBase for correct image source */}
        <img
          src={`${imageBase}${cart.images}`}
          alt={cart.name}
          className="w-20 h-20 rounded-md object-contain border mix-blend-multiply"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="">
              <h3 className="font-semibold text-gray-900">
                {cart.name}
              </h3>
              <p className="text-sm text-gray-600">Category: {cart.category}</p>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-white bg-black hover:bg-primary/80 mt-1">
                {cart.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            {/* 🗑️ Deletion is correct, just ensuring ID is a number */}
            <button onClick={() => removeCartItem(Number(cart.id))}>
              <i className="bx bx-trash text-lg text-red-500"></i>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Quantity decrement safeguard: check if quantity > 1 */}
              <button
                onClick={() => quantity > 1 && updateCartItem(cart.id, quantity - 1)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground w-7 h-7 rounded-md"
              >
                <i className="bx bx-minus"></i>
              </button>
              <span className="text-sm font-medium text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => updateCartItem(cart.id, quantity + 1)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground w-7 h-7 rounded-md"
              >
                <i className="bx bx-plus"></i>
              </button>
            </div>
            <div className="text-right">
              {discount > 0 ? (
                <>
                  {/* Use pre-calculated values and toFixed(2) */}
                  <div className="font-semibold text-gray-900">
                    ${discountedPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    ${price.toFixed(2)}
                  </div>
                </>
              ) : (
                <div className="font-semibold text-gray-900">
                  ${price.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartListProduct;










// import React, { useContext } from "react";
// import { CartContext } from "../context/CartProvider";

// const CartListProduct = ({ cart }) => {
//   const { removeCartItem, updateCartItem } = useContext(CartContext);
//   return (
//     <div className="p-6">
//       <div className="flex gap-4">
//         <img
//           src={cart.images}
//           alt=""
//           className="w-20 h-20 rounded-md object-cover border"
//         />
//         <div className="flex-1">
//           <div className="flex justify-between items-start mb-2">
//             <div className="">
//               <h3 className="font-semibold text-gray-900">
//                 {cart.name}
//               </h3>
//               <p className="text-sm text-gray-600">Category: {cart.category}</p>
//               <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-white bg-black hover:bg-primary/80 mt-1">
//                 {cart.stock > 0 ? "In Stock" : "Out of Stock"}
//               </span>
//             </div>
//            <button onClick={() => removeCartItem(Number(cart.id))}>
//               <i className="bx bx-trash text-lg text-red-500"></i>
//             </button>
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-5">
//               <button onClick={() => updateCartItem(cart.id, cart.quantity - 1)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground w-7 h-7 rounded-md">
//                 <i className="bx bx-minus"></i>
//               </button>
//               <span className="text-sm font-medium text-gray-900">
//                 {cart.quantity}
//               </span>
//               <button onClick={() => updateCartItem(cart.id, cart.quantity + 1)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground w-7 h-7 rounded-md">
//                 <i className="bx bx-plus"></i>
//               </button>
//             </div>
//             <div className="text-right">
//               {cart.discount > 0 ? (
//                 <>
//                   <div className="font-semibold text-gray-900">
//                     ${cart.price - cart.price * cart.discount / 100}
//                   </div>
//                   <div className="text-sm text-gray-500 line-through">
//                     ${cart.price}
//                   </div>
//                 </>
//               ) : (
//                 <div className="font-semibold text-gray-900">
//                   ${cart.price}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartListProduct;
