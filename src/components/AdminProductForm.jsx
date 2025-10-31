import { ProductContext } from "../context/ProductProvider";
import React, { useEffect, useState, useCallback,useContext } from "react";
import axios from "axios";
import { FaTimesCircle, FaEdit, FaBoxOpen } from 'react-icons/fa'; // Import an icon for removal

// const API = "http://localhost:8081/api/admin/products";
// const UPLOAD_API = "http://localhost:8081/api/admin/products/upload";
// const IMAGE_BASE_URL = "http://localhost:8081"; // ⬅ NEW: Define the base URL
const API = "https://e-trade-project-production.up.railway.app/api/admin/products";
const UPLOAD_API = "https://e-trade-project-production.up.railway.app/api/admin/products/upload";
const IMAGE_BASE_URL = "https://e-trade-project-production.up.railway.app"; // ⬅ NEW: Define the base URL

const AdminProductForm = ({ product, onSaved, onCancel }) => {
    const [name, setName] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]); // Array for files to upload
    const [existingImageUrls, setExistingImageUrls] = useState([]); // ⬅ CHANGED: Array of relative paths (e.g., ["/images/..."])
    const [previewFileUrls, setPreviewFileUrls] = useState([]); // Preview URLs for NEWLY selected files
    const [stockStatus, setStockStatus] = useState("in_stock");
    const [category, setCategory] = useState("smartphones");
    const [currentPrice, setCurrentPrice] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [saving, setSaving] = useState(false);
    const { fetchProduct } = useContext(ProductContext);

    const CATEGORIES = [
        "Smartphones", "Laptops", "Tablets", "Smartwatches", "Headphones",
        "Keyboards", "Mouses", "Cameras", "Drones", "Smart Home Devices",
        "Monitor", "Gaming Consoles", "Printers", "Routers", "Wearables",
    ];  

    const toSlug = (name) => name.toLowerCase().replace(/\s/g, '_');

    // Cleanup function for object URLs
    useEffect(() => {
        return () => {
            previewFileUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewFileUrls]);

    //  FIXED: UseEffect logic for populating the form
    useEffect(() => {
        // Clear previous previews/files/existing URLs
        setSelectedFiles([]);
        setPreviewFileUrls([]);
        setExistingImageUrls([]);

        if (product) {
            setName(product.name || "");
            try {
                // The incoming product.images is a JSON string, which your parent component should have parsed.
                // Assuming the parent component (Products.js) is fixed to pass an array for product.images:
                // If the parent hasn't been fixed, change `product.images` to `JSON.parse(product.images || "[]")` here.
                const imgs = Array.isArray(product.images)
                    ? product.images.filter(Boolean) // Use array if passed
                    : JSON.parse(product.images || "[]").filter(Boolean); // Fallback to parsing string

                setExistingImageUrls(imgs); // Store the array of relative paths
            } catch (e) {
                console.error("Failed to parse product images:", e);
                setExistingImageUrls([]);
            }
            setStockStatus(product.stockStatus || "in_stock");
            setCategory(product.category || "smartphones");
            setCurrentPrice(product.currentPrice ?? "");
            setOldPrice(product.oldPrice ?? "");
            setDiscountPercent(product.discountPercent ?? 0);
            setDescription(product.description || "");
            setColor(product.color || "");
        } else {
            // Reset for new product
            setName("");
            setStockStatus("in_stock");
            setCategory("smartphones");
            setCurrentPrice("");
            setOldPrice("");
            setDiscountPercent(0);
            setDescription("");
            setColor("");
        }
    }, [product]);

    const uploadImages = async () => {
        // If no new files, just return the existing URLs for the final payload
        if (selectedFiles.length === 0) {
            return existingImageUrls;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append("files", file);
        });

        try {
            const res = await axios.post(UPLOAD_API, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const newUrls = res.data || []; // Array of new relative paths

            // Combine existing (those not removed) and newly uploaded relative paths
            return [...existingImageUrls, ...newUrls];
        } catch (err) {
            console.error("Image upload failed:", err);
            throw new Error("Image upload failed");
        }
    };

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     let finalImageUrls = [];
//     try {
//         finalImageUrls = await uploadImages();
//     } catch (error) {
//         setSaving(false);
//         alert(error.message);
//         return;
//     }

//     const payload = {
//         name: name.trim() || "Unnamed Product",
//         images: JSON.stringify(finalImageUrls),
//         stockStatus: stockStatus || "in_stock",
//         category,
//         currentPrice: parseFloat(currentPrice) || 0,
//         oldPrice: parseFloat(oldPrice) || 0,
//         discountPercent: parseInt(discountPercent) || 0,
//         description: description || "",
//         color: color || "",
//     };

//     try {
//         let res;
//         if (product && product.id) {
//             res = await axios.put(`${API}/${product.id}`, payload);
//         } else {
//             res = await axios.post(API, payload);
//         }

//         //  Refresh the product list in context
//         await fetchProduct();

//         //  Trigger any parent updates or close modal
//         onSaved(res.data);

//     } catch (err) {
//         console.error(err);
//         alert("Product save failed");
//     } finally {
//         setSaving(false);
//     }
// };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        let finalImageUrls = [];
        try {
            // This includes existing (non-removed) and newly uploaded relative paths
            finalImageUrls = await uploadImages();
        } catch (error) {
            setSaving(false);
            alert(error.message);
            return;
        }

        const payload = {
            name: name.trim() || "Unnamed Product",
            images: JSON.stringify(finalImageUrls), // ⬅ Must stringify before sending to Spring Boot
            stockStatus: stockStatus || "in_stock",
            category: category,
            currentPrice: parseFloat(currentPrice) || 0,
            oldPrice: parseFloat(oldPrice) || 0,
            discountPercent: parseInt(discountPercent) || 0,
            description: description || "",
            color: color || ""
        };

        try {
            let res;
            if (product && product.id) {
                res = await axios.put(`${API}/${product.id}`, payload);
            } else {
                res = await axios.post(API, payload);
            }
            onSaved(res.data);
        } catch (err) {
            console.error(err);
            alert("Product save failed");
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = (e) => {
        // Revoke old object URLs to prevent memory leaks
        previewFileUrls.forEach(url => URL.revokeObjectURL(url));

        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Generate new preview URLs for newly selected files
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewFileUrls(newPreviewUrls);
    };

    //  NEW FUNCTION: Allows removal of existing images during edit
    const removeExistingImage = (urlToRemove) => {
        setExistingImageUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
    };


    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white max-w-5xl mx-auto mt-6 p-5 sm:p-6 shadow-md rounded-xl border border-gray-200"
        >
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-5 text-gray-800">
                {product ? (
                    <>
                        <FaEdit className="text-blue-600 text-2xl" />
                        <h3 className="text-xl sm:text-2xl font-semibold">Edit Product</h3>
                    </>
                ) : (
                    <>
                        <FaBoxOpen className="text-green-600 text-2xl" />
                        <h3 className="text-xl sm:text-2xl font-semibold">Create New Product</h3>
                    </>
                )}
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter product name"
                        className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                {/* Stock Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Status
                    </label>
                    <select
                        value={stockStatus}
                        onChange={(e) => setStockStatus(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="preorder">Preorder</option>
                    </select>
                </div>

                {/* Color */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                    </label>
                    <input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="e.g., Red, Blue"
                        className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={toSlug(cat)}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Current Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Price
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={currentPrice}
                        onChange={(e) => setCurrentPrice(e.target.value)}
                        placeholder="e.g., 25.99"
                        className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                {/* Old Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Old Price
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={oldPrice}
                        onChange={(e) => setOldPrice(e.target.value)}
                        placeholder="e.g., 30.00"
                        className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                {/* Discount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount %
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                        placeholder="e.g., 10"
                        className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
                 {/* Image Upload */}
                <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Images
                    </label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 p-2 rounded-md text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {existingImageUrls.length > 0 && `Existing: ${existingImageUrls.length}. `}
                        {selectedFiles.length > 0 && `New files: ${selectedFiles.length}. `}
                        {!existingImageUrls.length && !selectedFiles.length && "No images selected."}
                    </p>

                    {/* Image Previews */}
                    <div className="mt-3 flex flex-wrap gap-3">
                        {existingImageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={`${IMAGE_BASE_URL}${url}`}
                                    alt={`Existing ${index}`}
                                    className="w-20 h-20 object-contain rounded-md shadow border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(url)}
                                    className="absolute top-0.5 right-0.5 bg-white rounded-full p-0.5 shadow hover:bg-red-100 transition"
                                    title="Remove image"
                                >
                                    <FaTimesCircle className="text-red-600 text-xs" />
                                </button>
                            </div>
                        ))}

                        {previewFileUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Preview ${index}`}
                                className="w-20 h-20 object-cover rounded-md border-2 border-green-400 shadow"
                            />
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        placeholder="Write something about this product..."
                        className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    ></textarea>
                </div>
            </div>
            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-70"
                >
                    {saving ? "Saving..." : "Save Product"}
                </button>
            </div>
        </form>
    );
};

export default AdminProductForm;



































// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:8081/api/admin/products";
// const UPLOAD_API = "http://localhost:8081/api/admin/products/upload";

// const AdminProductForm = ({ product, onSaved, onCancel }) => {
//     const [name, setName] = useState("");
//     const [selectedFiles, setSelectedFiles] = useState([]); // Array for files to upload
//     const [imageUrls, setImageUrls] = useState(""); // Stores current/existing URLs (comma-separated string)
//     const [previewUrls, setPreviewUrls] = useState([]); //  NEW STATE FOR PREVIEW URLS
//     const [stockStatus, setStockStatus] = useState("in_stock");
//     const [category, setCategory] = useState("smartphones");
//     const [currentPrice, setCurrentPrice] = useState("");
//     const [oldPrice, setOldPrice] = useState("");
//     const [discountPercent, setDiscountPercent] = useState(0);
//     const [description, setDescription] = useState("");
//     const [color, setColor] = useState("");
//     const [saving, setSaving] = useState(false);

//     const CATEGORIES = [
//         "Smartphones", "Laptops", "Tablets", "Smartwatches", "Headphones",
//         "Keyboards", "Mouses", "Cameras", "Drones", "Smart Home Devices",
//         "Monitor", "Gaming Consoles", "Printers", "Routers", "Wearables", "Monitors"
//     ];

//     const toSlug = (name) => name.toLowerCase().replace(/\s/g, '_');

//     useEffect(() => {
//         if (product) {
//             setName(product.name || "");
//             try {
//                 const imgs = JSON.parse(product.images || "[]");
//                 setImageUrls(imgs.join(", ")); // Set existing URLs string
//                 // Set existing URLs for initial preview too if desired, but typically new previews are only for selected files
//             } catch (e) {
//                 setImageUrls("");
//             }
//             setStockStatus(product.stockStatus || "in_stock");
//             setCategory(product.category || "smartphones");
//             setCurrentPrice(product.currentPrice ?? "");
//             setOldPrice(product.oldPrice ?? "");
//             setDiscountPercent(product.discountPercent ?? 0);
//             setDescription(product.description || "");
//             setColor(product.color || "");
//         } else {
//             // Reset for new product
//             setName("");
//             setImageUrls("");
//             setSelectedFiles([]);
//             setPreviewUrls([]); //  RESET PREVIEW URLS
//             setStockStatus("in_stock");
//             setCategory("smartphones");
//             setCurrentPrice("");
//             setOldPrice("");
//             setDiscountPercent(0);
//             setDescription("");
//             setColor("");
//         }
//     }, [product]);

//     const uploadImages = async () => {
//         if (selectedFiles.length === 0) {
//             return imageUrls.split(",").map(i => i.trim()).filter(Boolean);
//         }

//         const formData = new FormData();
//         selectedFiles.forEach(file => {
//             formData.append("files", file);
//         });

//         try {
//             const res = await axios.post(UPLOAD_API, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             const newUrls = res.data || []; //  fixed
//             const existingUrls = imageUrls.split(",").map(i => i.trim()).filter(Boolean);
//             return [...existingUrls, ...newUrls];
//         } catch (err) {
//             console.error("Image upload failed:", err);
//             throw new Error("Image upload failed");
//         }
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSaving(true);

//         let finalImageUrls = [];
//         try {
//             finalImageUrls = await uploadImages();
//         } catch (error) {
//             setSaving(false);
//             alert(error.message);
//             return;
//         }

//         const payload = {
//             name: name.trim() || "Unnamed Product",
//             images: JSON.stringify(finalImageUrls),
//             stockStatus: stockStatus || "in_stock",
//             category: category,
//             currentPrice: parseFloat(currentPrice) || 0,
//             oldPrice: parseFloat(oldPrice) || 0,
//             discountPercent: parseInt(discountPercent) || 0,
//             description: description || "",
//             color: color || ""
//         };

//         try {
//             let res;
//             if (product && product.id) {
//                 res = await axios.put(`${API}/${product.id}`, payload);
//             } else {
//                 res = await axios.post(API, payload);
//             }
//             onSaved(res.data);
//         } catch (err) {
//             console.error(err);
//             alert("Product save failed");
//         } finally {
//             setSaving(false);
//         }
//     };

//     //  UPDATED HANDLER FOR FILE INPUT CHANGE
//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);
//         setSelectedFiles(files);

//         // Generate preview URLs
//         const newPreviewUrls = files.map(file => URL.createObjectURL(file));
//         setPreviewUrls(newPreviewUrls);

//         // Clean up old object URLs when component unmounts or new files are selected
//         // This is important to prevent memory leaks
//         return () => {
//             previewUrls.forEach(url => URL.revokeObjectURL(url));
//         };
//     };


//     return (
//         <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {/* Product Name */}
//                 <div>
//                     <label className="block text-sm">Name</label>
//                     <input required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" />
//                 </div>

//                 {/*  IMAGE UPLOAD INPUT WITH PREVIEWS */}
//                 <div>
//                     <label className="block text-sm">Upload Images (Select one or more)</label>
//                     <input
//                         type="file"
//                         multiple
//                         onChange={handleFileChange}
//                         className="w-full border p-2 rounded file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                     />
//                     {imageUrls && (
//                         <p className="text-xs text-gray-500 mt-1">
//                             Current existing images: {imageUrls.split(',').length}
//                         </p>
//                     )}
//                     {selectedFiles.length > 0 && (
//                         <p className="text-xs text-gray-500 mt-1">
//                             New files selected for upload: {selectedFiles.length}
//                         </p>
//                     )}

//                     {/* Image Previews */}
//                     <div className="mt-2 flex flex-wrap gap-2">
//                         {/* Previews for newly selected files */}
//                         {previewUrls.map((url, index) => (
//                             <img
//                                 key={index}
//                                 src={url}
//                                 alt={`Preview ${index}`}
//                                 className="w-24 h-24 object-cover rounded shadow-md"
//                             />
//                         ))}
//                         {/* Optional: Display previews of existing product images */}
//                         {product && imageUrls && imageUrls.split(',').filter(Boolean).map((url, index) => (
//                             <img
//                                 key={`existing-${index}`}
//                                 src={url.trim()} // Use the actual URL from the product
//                                 alt={`Existing ${index}`}
//                                 className="w-24 h-24 object-cover rounded shadow-md border border-dashed border-gray-300"
//                             />
//                         ))}
//                     </div>
//                 </div>

//                 {/* Stock Status */}
//                 <div>
//                     <label className="block text-sm">Stock Status</label>
//                     <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className="w-full border p-2 rounded">
//                         <option value="in_stock">In Stock</option>
//                         <option value="out_of_stock">Out of Stock</option>
//                         <option value="preorder">Preorder</option>
//                     </select>
//                 </div>

//                 {/* Color */}
//                 <div>
//                     <label className="block text-sm">Color</label>
//                     <input value={color} onChange={e => setColor(e.target.value)} className="w-full border p-2 rounded" />
//                 </div>

//                 {/* Current Price */}
//                 <div>
//                     <label className="block text-sm">Current Price</label>
//                     <input type="number" step="0.01" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} className="w-full border p-2 rounded" />
//                 </div>

//                 {/* Old Price */}
//                 <div>
//                     <label className="block text-sm">Old Price</label>
//                     <input type="number" step="0.01" value={oldPrice} onChange={e => setOldPrice(e.target.value)} className="w-full border p-2 rounded" />
//                 </div>

//                 {/* Discount % */}
//                 <div>
//                     <label className="block text-sm">Discount %</label>
//                     <input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} className="w-full border p-2 rounded" />
//                 </div>

//                 {/* CATEGORY SELECT INPUT */}
//                 <div>
//                     <label className="block text-sm">Category</label>
//                     <select
//                         value={category}
//                         onChange={e => setCategory(e.target.value)}
//                         className="w-full border p-2 rounded"
//                     >
//                         {CATEGORIES.map(cat => (
//                             <option key={cat} value={toSlug(cat)}>
//                                 {cat}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Description */}
//                 <div className="md:col-span-2">
//                     <label className="block text-sm">Description</label>
//                     <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" rows="4"></textarea>
//                 </div>
//             </div>

//             <div className="mt-3 flex gap-2">
//                 <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
//                 <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
//                     {saving ? "Saving..." : "Save Product"}
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default AdminProductForm;








// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const API = "http://localhost:8081/api/admin/products";

// // const AdminProductForm = ({ product, onSaved, onCancel }) => {
// //     const [name, setName] = useState("");
// //     const [imagesText, setImagesText] = useState(""); // comma separated URLs
// //     const [stockStatus, setStockStatus] = useState("in_stock");
// //     const [currentPrice, setCurrentPrice] = useState("");
// //     const [oldPrice, setOldPrice] = useState("");
// //     const [discountPercent, setDiscountPercent] = useState(0);
// //     const [description, setDescription] = useState("");
// //     const [color, setColor] = useState("");
// //     const [saving, setSaving] = useState(false);

// //     useEffect(() => {
// //         if (product) {
// //             setName(product.name || "");
// //             try {
// //                 const imgs = JSON.parse(product.images || "[]");
// //                 setImagesText(imgs.join(", "));
// //             } catch (e) {
// //                 setImagesText("");
// //             }
// //             setStockStatus(product.stockStatus || "in_stock");
// //             setCurrentPrice(product.currentPrice ?? "");
// //             setOldPrice(product.oldPrice ?? "");
// //             setDiscountPercent(product.discountPercent ?? 0);
// //             setDescription(product.description || "");
// //             setColor(product.color || "");
// //         } else {
// //             // reset
// //             setName("");
// //             setImagesText("");
// //             setStockStatus("in_stock");
// //             setCurrentPrice("");
// //             setOldPrice("");
// //             setDiscountPercent(0);
// //             setDescription("");
// //             setColor("");
// //         }
// //     }, [product]);

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setSaving(true);
// //         // build product payload
// //         const imgsArray = imagesText.split(",").map(i => i.trim()).filter(Boolean);
// //         const payload = {
// //             name: name.trim() || "Unnamed Product",
// //             images: JSON.stringify(imgsArray),
// //             stockStatus: stockStatus || "in_stock",
// //             currentPrice: parseFloat(currentPrice) || 0,
// //             oldPrice: parseFloat(oldPrice) || 0,
// //             discountPercent: parseInt(discountPercent) || 0,
// //             description: description || "",
// //             color: color || ""
// //         };

// //         try {
// //             let res;
// //             if (product && product.id) {
// //                 res = await axios.put(`${API}/${product.id}`, payload);
// //             } else {
// //                 res = await axios.post(API, payload);
// //             }
// //             onSaved(res.data);
// //         } catch (err) {
// //             console.error(err);
// //             alert("Save failed");
// //         } finally {
// //             setSaving(false);
// //         }
// //     };
// //     return (
// //         <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                 <div>
// //                     <label className="block text-sm">Name</label>
// //                     <input required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" />
// //                 </div>

// //                 <div>
// //                     <label className="block text-sm">Images (comma separated URLs)</label>
// //                     <input value={imagesText} onChange={e => setImagesText(e.target.value)} className="w-full border p-2 rounded" />
// //                 </div>

// //                 <div>
// //                     <label className="block text-sm">Stock Status</label>
// //                     <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className="w-full border p-2 rounded">
// //                         <option value="in_stock">In Stock</option>
// //                         <option value="out_of_stock">Out of Stock</option>
// //                         <option value="preorder">Preorder</option>
// //                     </select>
// //                 </div>

// //                 <div>
// //                     <label className="block text-sm">Color</label>
// //                     <input value={color} onChange={e => setColor(e.target.value)} className="w-full border p-2 rounded" />
// //                 </div>

// //                 <div>
// //                     <label className="block text-sm">Current Price</label>
// //                     <input type="number" step="0.01" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} className="w-full border p-2 rounded" />
// //                 </div>

// //                 <div>
// //                     <label className="block text-sm">Old Price</label>
// //                     <input type="number" step="0.01" value={oldPrice} onChange={e => setOldPrice(e.target.value)} className="w-full border p-2 rounded" />
// //                 </div>

// //                 <div>
// //                     <label className="block text-sm">Discount %</label>
// //                     <input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} className="w-full border p-2 rounded" />
// //                 </div>
// //                 <div>
// //                     <label className="block text-sm">Category</label>
// //                     <select
// //                         value={stockStatus}
// //                         onChange={e => setStockStatus(e.target.value)}
// //                         className="w-full border p-2 rounded"
// //                     >
// //                         <option value="smartphones">Smartphones</option>
// //                         <option value="laptops">Laptops</option>
// //                         <option value="tablets">Tablets</option>
// //                         <option value="smartwatches">Smartwatches</option>
// //                         <option value="headphones">Headphones</option>
// //                         <option value="keyboards">Keyboards</option>
// //                         <option value="mouses">Mouses</option>
// //                         <option value="cameras">Cameras</option>
// //                         <option value="drones">Drones</option>
// //                         <option value="smart_home_devices">Smart Home Devices</option>
// //                         <option value="monitor">Monitor</option>
// //                         <option value="gaming_consoles">Gaming Consoles</option>
// //                         <option value="printers">Printers</option>
// //                         <option value="routers">Routers</option>
// //                         <option value="wearables">Wearables</option>
// //                         <option value="monitors">Monitors</option>
// //                     </select>
// //                 </div>
// //                 <div className="md:col-span-2">
// //                     <label className="block text-sm">Description</label>
// //                     <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" rows="4"></textarea>
// //                 </div>
// //             </div>

// //             <div className="mt-3 flex gap-2">
// //                 <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
// //                 <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
// //                     {saving ? "Saving..." : "Save Product"}
// //                 </button>
// //             </div>
// //         </form>
// //     );
// // };

// // export default AdminProductForm;
