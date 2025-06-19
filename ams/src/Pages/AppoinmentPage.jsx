import React, { useState, useEffect } from "react";
import axios from "axios";
import Appointments from "../Components/Appoinments";
import ConfirmedAppointments from "../Pages/ConfirmedAppointments";
import LogoutWarning from "@/Components/LogoutWarning";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const AppointmentPage = () => {
  const token = localStorage.getItem("token");
  const outletId = JSON.parse(localStorage.getItem("outlet")).outlet_id;
  const [appointments, setAppointments] = useState([]);
  const [Confirmed, setConfirmed] = useState([]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/app/appointment/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: {
            outlet_id: outletId,
          },
        }
      );
      setAppointments(() =>
        response.data.appointment.filter(
          (appointment) => appointment.status === "pending"
        )
      );
      setConfirmed(() =>
        response.data.appointment.filter(
          (appointment) => appointment.status === "confirmed"
        )
      );
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // useEffect(() => {
  //   const authData = localStorage.getItem("token");
  //   if (authData) {
  //     try {
  //       const decoded = jwtDecode(authData.token);
  //       const currentTime = Date.now() / 1000;
  //       if (decoded.exp < currentTime) {
  //         localStorage.removeItem("auth_data");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchAppointments();
  // }, []);

  return (
    <>
      {token ? (
        <div
          className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 p-4"
          style={{ backgroundSize: "cover" }}
        >
          <Card className="w-full max-w-6xl bg-white/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Appointment Management
              </CardTitle>
              <CardDescription className="text-center text-sm text-gray-500">
                Manage your appointments efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Appointments
                  appointments={appointments}
                  onRefresh={fetchAppointments}
                />
                <ConfirmedAppointments confirmappointments={Confirmed} />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <LogoutWarning />
      )}
    </>
  );
};

export default AppointmentPage;
