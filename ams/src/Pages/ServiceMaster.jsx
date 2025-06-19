import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../Data/service';
import edit from "../assets/edit _button.svg";  // Your edit icon
import axios from 'axios'; // Axios to handle API calls
import { useState, useEffect } from 'react';
import LogoutWarning from '@/Components/LogoutWarning';
import { jwtDecode } from 'jwt-decode';

const ServiceMaster = () => {
  const [services, setServices] = useState([]);
  const token = localStorage.getItem("token")
  const outletId = JSON.parse(localStorage.getItem("outlet"))?.id
  // const [services, setServices] = useState(services);
  // const handleDelete = (id) => {
  // const updatedServices = services.filter(service => service.id !== id);
  // setServices(updatedServices);
  //   };
  useEffect(() => {
    console.log(token);
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("auth_data");
        setToken({ token: "", user_data: {} });
      }
    } catch (error) {
      console.log(error);
    }
  }, [])
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/api/services/get/all`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params:{
            outletId:outletId
          }
          
        });
        console.log("fetched services",response.data)
        setServices(response.data);
      } catch (error) {
        console.error("There was an error fetching services!", error);
      }
    };

    fetchServices();
  }, []);

    // Delete service
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${import.meta.env.VITE_URL}/api/services/delete/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServices(services.filter(service => service.id !== id));
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    };
  return (
    <>
      {token ? (
        <div className="p-6">
          <h1 className="text-3xl mb-4">Service Master</h1>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b text-center">Name</th>
                  <th className="px-4 py-2 border-b text-center">Price(Rs.)</th>
                  <th className="px-4 py-2 border-b text-center">Duration</th>
                  <th className="px-4 py-2 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
              {services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-center">{service.name}</td>
                    <td className="px-4 py-2 border-b text-center">{service.price}</td>
                    <td className="px-4 py-2 border-b text-center">{service.duration} mins</td>
                    <td className="px-4 py-2 border-b text-center flex justify-center items-center">
                      <button
                        className="px-3 py-1 ml-2 w-20"
                        onClick={() => handleDelete(service.id)}
                      >
                        🗑️
                      </button>
                      <Link
                        to={`/edit-service/${service.id}`}
                        className="px-3 py-1 rounded m-1 w-20"
                      >
                        <img src={edit} alt="edit" />
                      </Link>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          <Link to="/add-service">
            <button className="bg-red-500 text-white px-4 py-2 rounded mt-4">
              Add Service
            </button>
          </Link>
        </div>
      ) : (
        <LogoutWarning />
      )}
    </>
  );
};

export default ServiceMaster;
