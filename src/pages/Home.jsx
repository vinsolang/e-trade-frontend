import React, { useContext } from "react";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../context/ProductProvider";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider.jsx";
import {
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Keyboard,
  Mouse,
  Camera,
  Drone,
  Monitor,
  Gamepad,
  Printer,
  Router,
  Activity,
  Home as SmartHome, // Alias Home to SmartHome to avoid conflict
} from "lucide-react";

// 1. Slug-to-Icon Mapping (Keys are slugs)
const categoryIcons = {
  'smartphones': Smartphone,
  'laptops': Laptop,
  'tablets': Tablet,
  'smartwatches': Watch,
  'headphones': Headphones,
  'keyboards': Keyboard,
  'mouses': Mouse,
  'cameras': Camera,
  'drones': Drone,
  'smart_home_devices': SmartHome, // Must match the slug created in ProductProvider
  'monitor': Monitor,
  'gaming_consoles': Gamepad,
  'printers': Printer,
  'routers': Router,
  'wearables': Activity,
};

// 2. Slug-to-Display Name Mapping (Keys are slugs)
const slugToDisplayName = {
  'smartphones': 'Smartphones',
  'laptops': 'Laptops',
  'tablets': 'Tablets',
  'smartwatches': 'Smartwatches',
  'headphones': 'Headphones',
  'keyboards': 'Keyboards',
  'mouses': 'Mouses',
  'cameras': 'Cameras',
  'drones': 'Drones',
  'smart_home_devices': 'Smart Home Devices',
  'monitor': 'Monitor',
  'gaming_consoles': 'Gaming Consoles',
  'printers': 'Printers',
  'routers': 'Routers',
  'wearables': 'Wearables',
};


const Home = () => {
  // 3. Destructure and rename the context variable for clarity
  const { allProducts, categories: categorySlugs } = useContext(ProductContext);

  return (
    <>
      <div className="">
        <div className="w-full bg-slate-100">
          <HeroSlider />
        </div>
      </div>

      <div className="">
        <div className="max-w-[1200px] m-auto py-10">
          <div className="flex justify-between items-center">
            <div className="">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent mb-2 bg-purple-100 text-purple-600 hover:bg-purple-100">
                Category
              </span>
              <h2 className="text-[27px] font-bold text-gray-900">
                Trending Categories
              </h2>
            </div>
            <Link to={"/products"} className="inline-flex items-center justify-center hover:bg-white gap-2 whitespace-nowrap rounded-md text-[13px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2">
              View All Product
            </Link>
          </div>
          
          {/* 4. Use the slugs from context to render categories */}
          <div className="flex gap-5 items-center mt-6 overflow-x-auto hideScrollBar px-2">
            {categorySlugs.map((slug) => {
              // Get the icon and display name using the slug key
              const Icon = categoryIcons[slug];
              const displayName = slugToDisplayName[slug] || slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              return (
                <Link
                  key={slug}
                  to="" // Use the slug for the link URL
                  className="min-w-[130px] shadow-sm hover:shadow-lg transition-all rounded-lg flex flex-col gap-2 justify-center items-center aspect-square border bg-white hover:bg-blue-50"
                >
                  <div className="flex justify-center items-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                    {Icon ? <Icon size={28} /> : null} {/* Render icon */}
                  </div>
                  <h3 className="text-sm font-medium text-gray-700 line-clamp-1">
                    {displayName} {/* Display readable name */}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-slate-50">
        <div className="max-w-[1200px] m-auto py-10">
          <div className="flex justify-between items-center">
            <div className="">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent mb-2 bg-purple-100 text-purple-600 hover:bg-purple-100">
                Our Products
              </span>
              <h2 className="text-[27px] font-bold text-gray-900">
                Explore Our Products
              </h2>
            </div>
            <Link to={"/products"} className="inline-flex items-center justify-center hover:bg-white gap-2 whitespace-nowrap rounded-md text-[13px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2">
              View All Product
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {/* Note: You should be mapping over a product array here */}
          
                <ProductCard /> 

          </div>
        </div>
      </div>
    </>
  );
};

export default Home;