import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import getUser from "../api/getUser";

const Navbar = () => {
  const [userData, setuserData] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const user = await getUser();
      if (user && Object.keys(user).length > 0) {
        setuserData(user);
        console.log(user.profilePicture);
      }
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      window.location.href = "http://localhost:5000/auth/google/signout";
      // window.location.href = "http://localhost:5000/auth/facebook/signout";
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              userData?.email?.split("@")[0].slice(0, 2).toUpperCase()
            )}
          </div>

          <h1 className="text-lg sm:text-2xl font-bold text-blue-600">
            {userData?.email
              ? userData.email.split("@")[0].slice(0, 100)
              : userData?.name}{" "}
            Dashboard
          </h1>
        </div>
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0 w-full sm:w-auto`}
        >
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="border-b border-gray-300 px-4 py-1 focus:outline-none hover:text-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
