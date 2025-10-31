import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartProvider";
import { FaArrowLeft } from 'react-icons/fa';

const API = "http://localhost:8081/api/admin/products";
const imageBase = "http://localhost:8081";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch single product
  const fetchProductDetail = async () => {
    try {
      const { data } = await axios.get(`${API}/${id}`);

      const formatted = {
        ...data,
        images: JSON.parse(data.images),
        discount: data.discountPercent,
        price: data.currentPrice,
        rate: data.rate || 4.5,
      };

      setProduct(formatted);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  return (
    <div className="max-w-[1200px] mx-auto">
        <Link 
      to={'/'} 
      // Add Tailwind CSS classes to style the link and center the icon/text
      className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium space-x-2"
    >
      {/* 1. Add the Icon component */}
      <FaArrowLeft className="w-4 h-4" /> 
      
      {/* 2. Add the text */}
      <span>Back to shopping</span>
    </Link>
      <div className="grid lg:grid-cols-2 gap-12 my-16">
        {/* Left side: Images */}
        <div>
          <div className="border-2 rounded-lg overflow-hidden mb-4">
            <img
              src={`${imageBase}${product.images[activeImage]}`}
              alt={product.name}
              className="w-full h-96 object-contain rounded-lg mix-blend-multiply"
            />
          </div>

          {/* <div className="flex gap-4 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`min-w-32 border-2 p-2 rounded-lg overflow-hidden ${
                  activeImage === index && "border-blue-600"
                }`}
              >
                <img
                  src={`${imageBase}${image}`}
                  alt=""
                  className="w-full h-16 object-contain rounded-lg mix-blend-multiply"
                />
              </button>
            ))}
          </div> */}
        </div>

        {/* Right side: Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Rating + Stock */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const rate = product.rate;
                  if (rate >= idx + 1) return <i key={idx} className="bx bxs-star"></i>;
                  if (rate >= idx + 0.5) return <i key={idx} className="bx bxs-star-half"></i>;
                  return <i key={idx} className="bx bx-star"></i>;
                })}
              </div>
              <span className="text-gray-600">{product.rate.toFixed(1)}</span>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                product.stockStatus === "in_stock"
                  ? "bg-green-600 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {product.stockStatus.replace("_", " ")}
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            {/* {product.discount > 0 ? ( */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-blue-600">
                 ${product.currentPrice?.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                   ${product.oldPrice?.toFixed(2)}
                </span>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                  Save {product.discount}%
                </div>
              </div>
            {/* ) : (
              <div className="text-3xl font-bold text-gray-900">${product.price}</div>
            )} */}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4">{product.description}</p>
          {/* Color */}
           <div className="mb-4">
                <label className="block text-xl font-bold text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  { product.color }
                </div>
              </div>
          {/* Quantity */}
          <div className="flex items-center gap-5 mb-8">
            <button
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
              className="border w-9 h-9 rounded-md flex justify-center items-center"
            >
              <i className="bx bx-minus"></i>
            </button>
            <span className="text-lg font-medium">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="border w-9 h-9 rounded-md flex justify-center items-center"
            >
              <i className="bx bx-plus"></i>
            </button>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-5 gap-4">
            <button
              onClick={() => addToCart(product.id, qty)}
              className="col-span-4 bg-black text-white py-3 rounded-md hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <i className="bx bx-cart"></i> Add to Cart
            </button>
            <button className="col-span-1 border border-gray-300 bg-white py-3 rounded-md hover:bg-gray-100 flex items-center justify-center">
              <i className="bx bx-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;






























// import React, { useContext, useEffect, useState } from "react";
// import { ProductContext } from "../context/ProductProvider";
// import { useParams } from "react-router-dom";
// import { CartContext } from "../context/CartProvider";
// // import { Link } from "react-router-dom";
// import axios from "axios";

// const API = "http://localhost:8081/api/admin/products";
// const imageBase = "http://localhost:8081";


// const ProductDetial = () => {
//   const { id } = useParams();
//   const { productDetail, fetchProductDetail } = useContext(ProductContext);
//   const { addToCart } = useContext(CartContext);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);

//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(API);

//       //  Convert "images" from string to array
//       const formatted = data.map((item) => ({
//         ...item,
//         images: JSON.parse(item.images), // convert to array
//         discount: item.discountPercent,  // rename for your UI
//         price: item.currentPrice,        // rename for your UI
//         rate: item.rate || 4.5           // fallback if no rating
//       }));

//       setAllProducts(formatted);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       alert("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   if (loading) return <p className="text-center py-10">Loading products...</p>;
  

//   useEffect(() => {
//     fetchProductDetail(id);
//   }, [id]);

//   if (!productDetail) return <div>Loading...</div>;

//   return (
//     <div>
//       <div className="max-w-[1200px] mx-auto">
//         <div className="grid lg:grid-cols-2 gap-12 my-16">
//           <div className="">
//             <div className="border-2 rounded-lg overflow-hidden mb-4">
//               <img
//                 src={productDetail.images[activeImage]}
//                 alt=""
//                 className="w-full h-96 object-contain rounded-lg mix-blend-multiply"
//               />
//             </div>
//             <div className="flex gap-4 overflow-x-auto">
//               {productDetail.images.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveImage(index)}
//                   className={`min-w-32 border-2 p-2 rounded-lg overflow-hidden ${
//                     activeImage === index && "border-blue-600"
//                   }`}
//                 >
//                   <img
//                     src={image}
//                     alt=""
//                     className="w-full h-16 object-contain rounded-lg mix-blend-multiply"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="">
//             <div className="mb-4">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 {productDetail.name}
//               </h1>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="flex items-center">
//                   <div className="flex text-yellow-400 mr-2">
//                     {Array.from({ length: 5 }).map((_, idx) => {
//                       const rate = productDetail.rate;
//                       if (rate >= idx + 1) {
//                         // Full star
//                         return <i key={idx} className="bx bxs-star"></i>;
//                       } else if (rate >= idx + 0.5) {
//                         // Half star
//                         return <i key={idx} className="bx bxs-star-half"></i>;
//                       } else {
//                         // Empty star
//                         return <i key={idx} className="bx bx-star"></i>;
//                       }
//                     })}
//                   </div>
//                   <div className="text-gray-600">
//                     {productDetail.rate.toFixed(1)}
//                   </div>
//                 </div>
//                 <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-black text-white hover:bg-primary/80">
//                   Instock
//                 </div>
//               </div>
//             </div>
//             <div className="mb-6">
//               {productDetail.discount > 0 ? (
//                 <div className="flex items-center gap-4 mb-4">
//                   <span className="text-2xl font-bold text-blue-600">
//                     $
//                     {productDetail.price -
//                       (productDetail.price * productDetail.discount) / 100}
//                   </span>
//                   <span className="text-lg text-gray-500 line-through">
//                     ${productDetail.price}
//                   </span>
//                   <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
//                     Save {productDetail.discount}%
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-3xl font-bold text-gray-900">
//                   ${productDetail.price}
//                 </div>
//               )}
//             </div>
//             <div className="mb-6">
//               <p className="text-gray-600">{productDetail.description}</p>
//             </div>
//             <div className="space-y-4 mb-6">
//               <div className="">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Color
//                 </label>
//                 <div className="flex gap-2">
//                   {["red", "blue", "green", "yellow", "purple"].map(
//                     (color, index) => (
//                       <button
//                         key={index}
//                         className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-5"
//                       >
//                         {color}
//                       </button>
//                     )
//                   )}
//                 </div>
//               </div>
//               <div className="">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Quantity
//                 </label>
//                 <div className="flex items-center gap-5">
//                   <button
//                     onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
//                     className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md"
//                   >
//                     <i className="bx bx-minus"></i>
//                   </button>
//                   <span className="text-lg font-medium text-gray-900">
//                     {qty}
//                   </span>
//                   <button
//                     onClick={() => setQty(qty + 1)}
//                     className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground w-9 h-9 rounded-md"
//                   >
//                     <i className="bx bx-plus"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-5 gap-4 mb-8">
//               <button onClick={() => addToCart(productDetail.id, qty)} className="col-span-4 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium bg-black text-white hover:bg-primary/90 h-11 rounded-md px-8 flex-1">
//                 <i className="bx bx-cart"></i> Add to Cart
//               </button>
//               <button className="col-span-1 inline-flex items-center justify-center gap-2 border border-gray-300 whitespace-nowrap text-sm font-medium bg-white text-black hover:bg-primary/90 h-11 rounded-md px-8 flex-1">
//                 <i className="bx bx-heart"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetial;
