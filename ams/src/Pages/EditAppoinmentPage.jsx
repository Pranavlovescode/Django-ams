import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppointmentForm from "../components/AppoinmentForm";
import axios from "axios";
import LogoutWarning from "@/components/LogoutWarning";
import {jwtDecode} from "jwt-decode";

const EditAppointmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment } = location.state || {};
  console.log("editting appointment",appointment)
  const handleSave = async (formData) => {
    console.log("formData",formData,"Appointment",appointment);
    try {
      // Transform data to match backend expectations (snake_case)
      const updateData = {
        appointment_time: formData.appointmentTime,
        services_id: formData.servicesId || [],
        packages_id: formData.packagesId || [],
      };
      
      console.log("Sending update data:", updateData);
      
      const response = await axios.patch(
        `${import.meta.env.VITE_URL}/app/appointment/`,
        updateData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          params:{
            appointment_id: appointment.appointment_id
          }
        }
      );
      console.log("Updated appointment:", response.data);
      alert("Appointment updated successfully");
      navigate("/appointments");
    } catch (error) {
      console.error("Error updating appointment:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Error: ${error.response.data.message || 'Failed to update appointment'}`);
      }
    }
  };

  const [token, setToken] = useState({
    token: "",
    user_data: {}
  });

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth_data"));
    if (authData) {
      setToken(authData);
      try {
        const decoded = jwtDecode(authData.token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("auth_data");
          setToken({ token: "", user_data: {} });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <>
      {token ? (
        <div className="">
          {/* <h1 className="text-3xl mb-4">Edit Appointment</h1> */}
          <AppointmentForm
            appointment={appointment}
            onSave={handleSave}
            onCancel={() => navigate("/appointments")}
          />
        </div>
      ) : (
        <LogoutWarning />
      )}
    </>
  );
};

export default EditAppointmentPage;
