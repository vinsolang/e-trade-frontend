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
  Home,
  Monitor,
  Gamepad,
  Printer,
  Router,
  Activity,
} from "lucide-react";

const categoryIcons = {
  Smartphones: Smartphone,
  Laptops: Laptop,
  Tablets: Tablet,
  Smartwatches: Watch,
  Headphones: Headphones,
  Keyboards: Keyboard,
  Mouses: Mouse,
  Cameras: Camera,
  Drones: Drone,
  "Smart Home Devices": Home,
  Monitor: Monitor,
  "Gaming Consoles": Gamepad,
  Printers: Printer,
  Routers: Router,
  Wearables: Activity,
};

const categories = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Smartwatches",
  "Headphones",
  "Keyboards",
  "Mouses",
  "Cameras",
  "Drones",
  "Smart Home Devices",
  "Monitor",
  "Gaming Consoles",
  "Printers",
  "Routers",
  "Wearables",
];

export default function CategoryList() {
  return (
    <div className="flex gap-5 items-center mt-6 overflow-x-auto hideScrollBar px-2">
      {categories.map((cate) => {
        const Icon = categoryIcons[cate];
        return (
          <Link
            key={cate}
            to={`/products/${cate.toLowerCase().replace(/\s+/g, "-")}`}
            className="min-w-[130px] shadow-sm hover:shadow-lg transition-all rounded-lg flex flex-col gap-2 justify-center items-center aspect-square border bg-white hover:bg-blue-50"
          >
            <div className="flex justify-center items-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
              <Icon size={28} />
            </div>
            <h3 className="text-sm font-medium text-gray-700 line-clamp-1">
              {cate}
            </h3>
          </Link>
        );
      })}
    </div>
  );
}
