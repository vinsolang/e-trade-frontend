
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";

const Dropdownn = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  //  Debug the user data
  useEffect(() => {
    console.log("Auth user from context:", user);
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
      >
        <i className="bx bx-user text-2xl"></i>
        <span className="text-sm font-medium">{user?.username || "User"}</span>
        <i className={`bx ${open ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md">
          <div className="px-4 py-2 text-gray-700 text-sm border-b">
            {user?.email || "No user data"}
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropdownn;
