import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ClientModal from "../components/Modal.jsx";
import Cameras from "../assets/silder/Cameras.webp";
import Laptops from "../assets/silder/Laptops.jpg";
import Tablets from "../assets/silder/Tablets.avif";
import Smartwatches from "../assets/silder/Smartwatches.avif";
import Headphones from "../assets/silder/Headphones.jpg";
import Keyboards from "../assets/silder/Keyboards.avif";
import Mouses from "../assets/silder/Mouses.jpg";


const categories = [
    {
        name: "Smartphones",
        price: "$1299",
        image:
            "https://bizweb.dktcdn.net/100/517/334/products/ip-15-pro-max-mhm-16837fc55e3c49e58d4b71a49cc5a920-1024x1024-7763584d-6ee4-48c5-aab5-e3d7bbde8f3e.jpg?v=1716308537983",
    },
    {
        name: "Laptops",
        price: "$1999",
        image:
            Laptops,
    },
    {
        name: "Tablets",
        price: "$899",
        image:
            Tablets,
    },
    {
        name: "Smartwatches",
        price: "$499",
        image:
            Smartwatches,
    },
    {
        name: "Headphones",
        price: "$299",
        image:
            Headphones,
    },
    {
        name: "Keyboards",
        price: "$149",
        image:
            Keyboards,
    },
    {
        name: "Mouses",
        price: "$99",
        image:
            Mouses
    },
    {
        name: "Cameras",
        price: "$1599",
        image:
            Cameras,
    },
];

const HeroSlider = () => {
    return (
        <div className="w-full bg-slate-100">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    reverseDirection: true,
                }}
                loop={true}
                pagination={{ clickable: true }}
                navigation
            ></Swiper>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000, // 3s delay between slides
                    disableOnInteraction: false,
                    reverseDirection: true, // run from right → left
                }}
                dir="rtl" // set direction right-to-left
                loop={true}
                speed={1000} // smooth transition
                className="max-w-[1400px] mx-auto py-6"
            >
                {categories.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className="bg-[#F8FAFC] w-full py-16">
                            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 px-6 md:px-12">

                                {/* Left: Text Section */}
                                <div className="order-2 md:order-1 flex flex-col justify-center text-left space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                                        <span className="text-sm font-medium text-gray-500">Best Deal This Week</span>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                                        {item.name}
                                    </h2>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-500 text-xl">
                                            <i className="bx bxs-star"></i>
                                            <i className="bx bxs-star"></i>
                                            <i className="bx bxs-star"></i>
                                            <i className="bx bxs-star"></i>
                                            <i className="bx bxs-star-half"></i>
                                        </div>
                                        <span className="text-gray-600 text-sm">(4.5)</span>
                                    </div>

                                    {/* Price */}
                                    <p className="text-4xl font-bold text-blue-600">
                                        {item.price}
                                    </p>

                                    {/* Button */}
                                    <Link to={"/products"} className="flex justify-center items-center bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                                        <button>
                                            Shop Now
                                        </button>
                                    </Link>

                                </div>

                                {/* Right: Product Image */}
                                <div className="order-1 md:order-2 flex justify-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-[280px] md:w-[380px] object-contain drop-shadow-xl"
                                    />
                                </div>
                            </div>
                        </div>

                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;
