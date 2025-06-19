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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle } from "lucide-react";

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
  useEffect(() => {
    fetchAppointments();
  }, []);
  return (
    <>
      {token ? (
        <div
          className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6 pt-10"
          style={{ backgroundSize: "cover" }}
        >
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Appointment Management 📅
                </h1>
                <p className="text-lg text-gray-600">
                  Manage and track your salon appointments
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-200">
                  <Clock className="w-4 h-4 mr-1" />
                  Pending: {appointments.length}
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Confirmed: {Confirmed.length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Tabs for Appointment Views */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-pink-200">
            <CardContent className="p-0">
              <Tabs defaultValue="pending" className="w-full">
                <div className="border-b border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50">
                  <TabsList className="grid w-full grid-cols-2 bg-transparent">
                    <TabsTrigger 
                      value="pending" 
                      className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Pending Appointments ({appointments.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="confirmed" 
                      className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirmed Appointments ({Confirmed.length})
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="pending" className="m-0">
                  <div className="p-6">
                    <Appointments
                      appointments={appointments}
                      onRefresh={fetchAppointments}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="confirmed" className="m-0">
                  <div className="p-6">
                    <ConfirmedAppointments 
                      confirmappointments={Confirmed}
                      onRefresh={fetchAppointments}
                    />
                  </div>
                </TabsContent>
              </Tabs>
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
