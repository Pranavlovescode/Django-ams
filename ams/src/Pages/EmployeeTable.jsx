import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EmployeeTable = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token")

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/api/user/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        setUsers(()=>response.data.filter(user => user.role != "CUSTOMER")); // Setting the users fetched from the backend
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">All Employees</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-center">Name</th>
              <th className="px-4 py-2 border-b text-center">Mobile Number</th>
              <th className="px-4 py-2 border-b text-center">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center">
                  {user.name || "N/A"}
                </td>{" "}
                {/* Correct field */}
                <td className="px-4 py-2 border-b text-center">
                  {user.mobileNumber || "N/A"}
                </td>{" "}
                {/* Correct field */}
                <td className="px-4 py-2 border-b text-center">
                  {user.email || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/employeeform">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Add New user
        </button>
      </Link>
    </div>
  );
};

export default EmployeeTable;
