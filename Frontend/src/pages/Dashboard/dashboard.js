import React, { useEffect, useState } from "react";
import Navbar from "../../shared/Navbar";
import getUserFromToken from "../../api/getUser";
import getUser from "../../api/getUser";

function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const userData = await getUser();
      console.log(userData);
      if (userData) {
        setUser(userData);
      }
    }
    fetchUserData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* User Info Section */}
        {user ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-blue-600">
              Welcome, {user.name}!
            </h2>
            <p className="text-gray-600 mt-2">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-600">
              <strong>Role:</strong> {user.role || "User"}
            </p>
            <p className="text-gray-600">
              <strong>Joined:</strong>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <span className="text-gray-600 break-words whitespace-pre-wrap">
              <strong>JWT TOKEN:</strong>
              {localStorage
                .getItem("token")
                ?.match(/.{1,50}/g)
                ?.join("\n")}
            </span>
          </div>
        ) : (
          <p className="text-gray-600">Loading user details...</p>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
