import React, { createContext, useEffect, useState } from "react";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortValue, setSortValue] = useState("");
  const [productDetail, setProductDetail] = useState(null);

  // Filter states
  const [categoryValue, setCategoryValue] = useState("");
  const [priceValue, setPriceValue] = useState(0);
  const [rateValue, setRateValue] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const API = "http://localhost:8081/api/admin/products";
  const imageBase = "http://localhost:8081"; // Prefix for backend image URLs

  //  Fetch all products
  const fetchProduct = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch products.");

      const data = await res.json();

      // Parse `images` JSON and add imageBase prefix
      const parsed = data.map((p) => ({
        ...p,
        images: JSON.parse(p.images).map((img) => `${imageBase}${img}`),
        rate: p.rate || 0, // Default rate if not available
        price: p.currentPrice || p.price || 0,
      }));

      setAllProducts(parsed);
      setProducts(parsed);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  //  Filter products dynamically
  const filterProducts = () => {
    const filtered = allProducts.filter((product) => {
      const categoryMatch =
        !categoryValue || product.category === categoryValue;

      const rateMatch = product.rate >= rateValue;

      const priceMatch =
        priceValue === 0 ||
        (priceValue === 1 && product.price < 50) ||
        (priceValue === 2 && product.price >= 50 && product.price <= 250) ||
        (priceValue === 3 && product.price > 250 && product.price <= 500) ||
        (priceValue === 4 && product.price > 500 && product.price <= 750) ||
        (priceValue === 5 && product.price > 750);

      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && rateMatch && priceMatch && searchMatch;
    });

    // Sort products if needed
    if (sortValue === "_sort=price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === "_sort=-price") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setProducts(filtered);
  };

  //  Fetch single product detail
  const fetchProductDetail = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product detail.");

      const data = await res.json();
      data.images = JSON.parse(data.images).map((img) => `${imageBase}${img}`);
      setProductDetail(data);
    } catch (error) {
      console.error("Error fetching product detail:", error.message);
    }
  };

  //  Search controls
  const handleSearch = (query) => setSearchQuery(query);
  const clearSearch = () => setSearchQuery("");

  // Run on mount and when sort changes
  useEffect(() => {
    fetchProduct();
  }, [sortValue]);

  // Re-filter whenever filters change
  useEffect(() => {
    filterProducts();
  }, [categoryValue, priceValue, rateValue, searchQuery, allProducts, sortValue]);

  // ⬇ Change: Convert static categories to slugs first
  const STATIC_CATEGORIES_SLUGGED = [
    "Smartphones", "Laptops", "Tablets", "Smartwatches", "Headphones",
    "Keyboards", "Mouses", "Cameras", "Drones", "Smart Home Devices",
    "Monitor", "Gaming Consoles", "Printers", "Routers", "Wearables",
  ].map(name => name.toLowerCase().replace(/\s/g, '_')); // Convert to slug format

  // Dynamic from DB (already in slug format, assuming the database stores the slug)
  const dynamicCategories = Array.from(
    new Set(allProducts.map((p) => p.category))
  ).filter(Boolean);

  // ⬇ Change: Merge & remove duplicates (all elements are now slugs)
  const categoriesSlugs = Array.from(new Set([...STATIC_CATEGORIES_SLUGGED, ...dynamicCategories]));

  // Optional: If you need the display name for the filter UI, you will need a map.
  // For now, let's export the slugs, as that's what your filter logic expects.
  const categories = categoriesSlugs;
  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        allProducts,
        productDetail,
        fetchProductDetail,

        // Filters
        setSortValue,
        setCategoryValue,
        setRateValue,
        setPriceValue,
        rateValue,
        priceValue,

        // Search
        searchQuery,
        handleSearch,
        clearSearch,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;



















// import React, { createContext, useContext, useEffect, useState } from "react";

// export const ProductContext = createContext();

// const ProductProvider = ({ children }) => {
//   const [allProducts, setAllProduct] = useState(null);
//   const [products, setProducts] = useState(null);
//   const [sortValue, setSortValue] = useState("");
//   const [productDetail, setProductDetail] = useState(null);
//   // Filter State
//   const [categoryValue, setCategoryValue] = useState("");
//   const [priceValue, setPriceValue] = useState(0);
//   const [rateValue, setRateValue] = useState(0);
//   // Search State
//   const [searchQuery, setSearchQuery] = useState("");

//   const fetchProduct = async () => {
//     try {
//       const res = await fetch(`http://localhost:3000/products?${sortValue}`);
//       if (!res.ok) {
//         throw new Error("Failed to fetch product.");
//       }
//       const data = await res.json();
//       setProducts(data);
//       setAllProduct(data);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const filtereProduct = () => {
//     const filteredProduct = allProducts?.filter((product) => {
//       const categoryMatch =
//         !categoryValue || product.category === categoryValue;
//       const rateMatch = product.rate >= rateValue;
//       const priceMatch =
//         priceValue === 0 ||
//         (priceValue === 1 && product.price < 50) ||
//         (priceValue === 2 && product.price >= 50 && product.price <= 250) ||
//         (priceValue === 3 && product.price > 250 && product.price <= 500) ||
//         (priceValue === 4 && product.price > 500 && product.price <= 750) ||
//         (priceValue === 5 && product.price > 750);

//       // Search functionality - search by name and category
//       const searchMatch =
//         !searchQuery ||
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.category.toLowerCase().includes(searchQuery.toLowerCase());

//       return categoryMatch && rateMatch && priceMatch && searchMatch;
//     });
//     setProducts(filteredProduct);
//   };

//   const fetchProductDetail = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:3000/products/${id}`);
//       if (!res.ok) {
//         throw new Error("Failed to fetch product detail.");
//       }
//       const data = await res.json();
//       setProductDetail(data);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [sortValue]);

//   useEffect(() => {
//     filtereProduct();
//   }, [categoryValue, priceValue, rateValue, searchQuery]);

//   let categories = [];
//   allProducts &&
//     allProducts.forEach((pro) => {
//       if (!categories.includes(pro.category)) {
//         categories.push(pro.category);
//       }
//     });

//   return (
//     <ProductContext.Provider
//       value={{
//         products,
//         categories,
//         setSortValue,
//         setCategoryValue,
//         setRateValue,
//         setPriceValue,
//         rateValue,
//         priceValue,
//         allProducts,
//         productDetail,
//         fetchProductDetail,
//         searchQuery,
//         handleSearch,
//         clearSearch,
//       }}
//     >
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export default ProductProvider;
