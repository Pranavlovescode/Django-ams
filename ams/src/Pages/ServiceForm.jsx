import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";

const ServiceForm = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState({
    name: "",
    price: "",
    duration: "",
    outlets: [],
    description: "",
    category: "",
  });
  const [allOutlets, setAllOutlets] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_URL}/api/services/get/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Fetched service data:", response.data); // Debugging

          setServiceData({
            name: response.data.name, // Use the correct field name as per your backend
            price: response.data.price.$numberDecimal || response.data.price, // Handle numberDecimal
            duration: response.data.duration,
          });
        } catch (error) {
          console.error("Error fetching service data:", error);
        }
      };

      fetchService(); // Call the async function
    }
  }, [id]); // Only re-run the effect if the `id` changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name == "duration") {
      newValue = value.length === 5 ? `${value}:00` : "value";
    }
    setServiceData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_URL}/api/services/update/${id}`,
          serviceData
        );
      } else {
        console.log("serviceData", serviceData);
        await axios.post(
          `${import.meta.env.VITE_URL}/api/services`,
          serviceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      navigate("/services");
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };
  useEffect(() => {
    // setToken(JSON.parse(sessionStorage.getItem("auth_data")));
    console.log(token);
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("auth_data");
        setToken({ token: "", user_data: {} });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const fetchAllOutlets = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/api/outlet/get/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched outlets:", response.data); // Debugging
        const outlets = response.data.map((outlet) => ({
          label: outlet.name,
          value: outlet.id,
        }));
        setAllOutlets(outlets);
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };

    fetchAllOutlets();
  }, []);

  const handlePackageChange = (selectedOptions) => {
    console.log("Selected options:", selectedOptions); // Debugging
    // console.log("outlet",outlets)
    const optionsArray = Array.isArray(selectedOptions)
      ? selectedOptions
      : selectedOptions
      ? [selectedOptions]
      : [];
    console.log("Options array:", optionsArray); // Debugging
    const selectedOutlets = optionsArray.map((option) => option.value);
    console.log("Selected outlets:", selectedOutlets); // Debugging
    setServiceData((prevState) => ({
      ...prevState,
      outlets: selectedOutlets,
    }));
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-3xl mb-4">{id ? "Edit Service" : "Add Service"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={serviceData.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Price</label>
            <input
              type="text"
              name="price"
              value={serviceData.price}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Duration</label>
            <input
              type="time"
              name="duration"
              value={serviceData.duration}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={serviceData.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Packages:</label>
            <Select
              isMulti
              className="basic-multi-select"
              options={allOutlets}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              value={allOutlets.filter((outlet) =>
                serviceData.outlets.includes(outlet.value)
              )}
              onChange={handlePackageChange}
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default ServiceForm;
