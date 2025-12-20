import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import edit from "../assets/edit _button.svg";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeSlots = [
  { label: "9:00 AM - 10:00 AM", start: "09:00", end: "10:00" },
  { label: "10:00 AM - 11:00 AM", start: "10:00", end: "11:00" },
  { label: "11:00 AM - 12:00 PM", start: "11:00", end: "12:00" },
  { label: "12:00 PM - 1:00 PM", start: "12:00", end: "13:00" },
  { label: "1:00 PM - 2:00 PM", start: "13:00", end: "14:00" },
  { label: "2:00 PM - 3:00 PM", start: "14:00", end: "15:00" },
  { label: "3:00 PM - 4:00 PM", start: "15:00", end: "16:00" },
  { label: "4:00 PM - 5:00 PM", start: "16:00", end: "17:00" },
];

const filterAppointments = (appointments, filter, timeSlot) => {
  const now = new Date();
  // Reset time to start of today for accurate date comparisons
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  let filteredAppointments = [...appointments]; // Create a copy to avoid mutation

  switch (filter) {
    case "All":
      // Show all appointments without date filtering
      break;
      
    case "Today":
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentTime = new Date(appointment.appointment_time);
        return appointmentTime >= todayStart && appointmentTime <= todayEnd;
      });
      break;

    case "Upcoming":
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentTime = new Date(appointment.appointment_time);
        return appointmentTime >= now;
      });
      break;

    case "This Week":
      const weekStart = new Date(todayStart);
      weekStart.setDate(todayStart.getDate() - todayStart.getDay()); // Start of week (Sunday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentTime = new Date(appointment.appointment_time);
        return appointmentTime >= weekStart && appointmentTime < weekEnd;
      });
      break;

    case "Last Week":
      const lastWeekEnd = new Date(todayStart);
      lastWeekEnd.setDate(todayStart.getDate() - todayStart.getDay()); // Start of this week = end of last week
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekEnd.getDate() - 7);
      
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentTime = new Date(appointment.appointment_time);
        return appointmentTime >= lastWeekStart && appointmentTime < lastWeekEnd;
      });
      break;

    case "This Month":
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentTime = new Date(appointment.appointment_time);
        return appointmentTime >= monthStart && appointmentTime <= monthEnd;
      });
      break;

    case "Last Month":
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentTime = new Date(appointment.appointment_time);
        return appointmentTime >= lastMonthStart && appointmentTime <= lastMonthEnd;
      });
      break;
      
    default:
      break;
  }

  if (timeSlot) {
    const [startHour, startMinute] = timeSlot.start.split(":");
    const [endHour, endMinute] = timeSlot.end.split(":");

    filteredAppointments = filteredAppointments.filter((appointment) => {
      const appointmentTime = new Date(appointment.appointment_time);
      const appointmentHours = appointmentTime.getHours();
      const appointmentMinutes = appointmentTime.getMinutes();

      const startTimeInMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
      const endTimeInMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
      const appointmentTimeInMinutes = appointmentHours * 60 + appointmentMinutes;

      return (
        appointmentTimeInMinutes >= startTimeInMinutes &&
        appointmentTimeInMinutes < endTimeInMinutes
      );
    });
  }

  return filteredAppointments;
};

const Appointments = ({ appointments, onRefresh }) => {
  const [filter, setFilter] = useState("All");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const handleConfirm = async (id) => {
    // e.proventDefault();
    try {
      const reponse = await axios.patch(`${import.meta.env.VITE_URL}/app/appointment/status/`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        params: {
          appointment_id: id,
          status: "confirmed",
        },
      });
      onRefresh();
    } catch (err) {
      console.error("Error confirming appointment:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (confirmDelete) {
      try {
          await axios.delete(`${import.meta.env.VITE_URL}/app/appointment/status/`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${localStorage.getItem("token")}`,
            },
            params: {
              appointment_id: id,
            },
          });
          onRefresh();
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Appointments received:", appointments);
    console.log("Current filter:", filter);
    console.log("Selected time slot:", selectedTimeSlot);
    console.log("Filtered appointments:", filterAppointments(appointments, filter, selectedTimeSlot));
  }, [appointments, filter, selectedTimeSlot]);

  const filteredAppointments = filterAppointments(
    appointments,
    filter,
    selectedTimeSlot
  );
  
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-pink-700">Sort by:</label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Appointments</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="Last Week">Last Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="Last Month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-pink-700">
            Time Slot:
          </label>
          <Select
            value={selectedTimeSlot ? selectedTimeSlot.label : ""}
            onValueChange={(val) => {
              const selectedOption = timeSlots.find((slot) => slot.label === val);
              setSelectedTimeSlot(selectedOption);
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Select Time Slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot, index) => (
                <SelectItem key={index} value={slot.label}>
                  {slot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-pink-50">
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Services</TableHead>
              <TableHead className="text-center">Packages</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No appointments found for the selected filter
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.appointment_id} className="hover:bg-pink-50">
                  <TableCell className="text-center">
                    {appointment.customer?.user?.first_name || ''} {appointment.customer?.user?.last_name || ''}
                  </TableCell>
                  <TableCell className="text-center">
                    {appointment.services?.length > 0 ? (
                      appointment.services.map((service, idx) => (
                        <div key={idx}>{service.name}</div>
                      ))
                    ) : (
                      <span className="text-gray-400">No services</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {appointment.packages?.length > 0 ? (
                      appointment.packages.map((pkg, idx) => (
                        <div key={idx}>{pkg.name}</div>
                      ))
                    ) : (
                      <span className="text-gray-400">No packages</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(appointment.appointment_time).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="default"
                        className="bg-green-600 text-white hover:bg-green-500"
                        onClick={(e) => handleConfirm(appointment.appointment_id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={(e) => handleDelete(appointment.appointment_id)}
                      >
                        Cancel
                      </Button>
                      <Link
                        to={`/edit-appointment/${appointment.appointment_id}`}
                        state={{
                          appointment: appointment
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        <img src={edit} alt="Edit" className="h-5 w-5" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Appointments;