
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../Components/AppoinmentForm";
import axios from "axios";
import LogoutWarning from "@/Components/LogoutWarning";
import { jwtDecode } from "jwt-decode";

const BookAppointmentPage = () => {
  const navigate = useNavigate();

  const handleSaveAppointment = async (formData) => {
    try {
      console.log(formData); // Add this line to check the data being sent

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/appointment/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("New appointment:", response.data);
      navigate("/appointments");
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setToken(getToken);
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("auth_data");
          setToken(getToken);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <>
      {token ? (
        <AppointmentForm
          onSave={handleSaveAppointment}
          onCancel={() => navigate("/appointments")}
        />
      ) : (
        <LogoutWarning />
      )}
    </>
  );
};

export default BookAppointmentPage;
