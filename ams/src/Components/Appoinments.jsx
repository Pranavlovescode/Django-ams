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
  let filteredAppointments = appointments;

  switch (filter) {
    case "Today":
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const inTime = new Date(appointment.appointment_time);
        return inTime.toDateString() === now.toDateString();
      });
      break;

    case "Last Week":
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const inTime = new Date(appointment.appointment_time);
        return inTime > oneWeekAgo && inTime <= now;
      });
      break;

    case "Last Month":
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const inTime = new Date(appointment.appointment_time);
        return inTime > oneMonthAgo && inTime <= now;
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
  const [filter, setFilter] = useState("Today");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const handleConfirm = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_URL}/api/appointment/complete/${id}`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        await axios.delete(`http://localhost:5000/api/delete-appointment-staff/${id}`);
        onRefresh();
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Appointments", appointments);
  }, [appointments]);

  const filteredAppointments = filterAppointments(
    appointments,
    filter,
    selectedTimeSlot
  );

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 p-4"
      style={{ backgroundSize: "cover" }}
    >
      <Card className="w-full max-w-6xl bg-white/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-pink-700">
            Appointments
          </CardTitle>
          <CardDescription className="text-center">
            Manage your salon appointments effortlessly
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-pink-700">Sort by:</label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="Last Week">Last Week</SelectItem>
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

          <div className="mt-4 overflow-x-auto">
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
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-pink-50">
                    <TableCell className="text-center">
                      {appointment.user.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {appointment.services.map((service, idx) => (
                        <div key={idx}>{service.name}</div>
                      ))}
                    </TableCell>
                    <TableCell className="text-center">
                      {appointment.packages.map((pkg, idx) => (
                        <div key={idx}>{pkg.name}</div>
                      ))}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(appointment.appointment_time).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/edit-appointment/${appointment.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          <img src={edit} alt="Edit" className="h-5 w-5" />
                        </Link>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => handleConfirm(appointment.id)}
                        >
                          Confirm
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;