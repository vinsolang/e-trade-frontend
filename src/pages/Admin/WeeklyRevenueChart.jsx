import React, { useState, useEffect } from "react";

// --- MOCK WEEKLY DATA ---
const MOCK_WEEKLY_REVENUE = [
  { day: "Mon", revenue: 1000 },
  { day: "Tue", revenue: 7500 },
  { day: "Wed", revenue: 12500 },
  { day: "Thu", revenue: 6000 },
  { day: "Fri", revenue: 15500 },
  { day: "Sat", revenue: 20000 },
  { day: "Sun", revenue: 4500 },
];

const WeeklyRevenueChart = () => {
  const [animatedData, setAnimatedData] = useState(
    MOCK_WEEKLY_REVENUE.map(d => ({ ...d, height: 0 }))
  );

  useEffect(() => {
    // Animate the bars after a short delay
    const timer = setTimeout(() => {
      setAnimatedData(
        MOCK_WEEKLY_REVENUE.map(d => ({
          ...d,
          height: ((d.revenue / 20000) * 80) + 10, // normalize 0-20k
        }))
      );
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        Weekly Revenue Trend (Mon – Sun)
      </h3>

      <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
        <h4 className="text-center text-sm text-gray-600 mb-2">
          Revenue Scale: $0 - $20,000
        </h4>

        {/* Chart Container */}
        <div className="flex justify-between items-end h-64 pt-4">
          {animatedData.map((data, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer">
              {/* Pillar */}
              <div
                style={{ height: `${data.height}%` }}
                className="w-10 bg-blue-500 rounded-t-lg transition-all duration-[1200ms] ease-out hover:bg-blue-700 relative"
              >
                {/* Tooltip */}
                <span className="absolute -top-6 text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${data.revenue.toLocaleString()}
                </span>
              </div>
              {/* Label */}
              <span className="text-xs mt-1 text-gray-600 font-medium">{data.day}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-center text-gray-400 mt-3">Days of the Week</p>
      </div>
    </div>
  );
};

export default WeeklyRevenueChart;
