import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/api/user/role-type`,{
            headers:{
                "Authorization":`Bearer ${token}`
            },
            params:{
                "role_type":"CUSTOMER"
            }
        });
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">All Users</h1>

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
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center">{user.name}</td>
                <td className="px-4 py-2 border-b text-center">{user.mobileNumber}</td>
                <td className="px-4 py-2 border-b text-center">{user.email || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/add-user">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Add New user
            </button>
          </Link>
    </div>
  );
};

export default UserTable;
