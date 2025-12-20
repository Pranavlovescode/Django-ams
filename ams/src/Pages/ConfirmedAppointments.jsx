import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import edit from "../assets/edit _button.svg";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const filterconfirmAppointments = (confirmappointments, filter, timeSlot) => {
  const now = new Date();
  // Reset time to start of today for accurate date comparisons
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  let filteredconfirmAppointments = [...confirmappointments]; // Create a copy to avoid mutation

  switch (filter) {
    case "All":
      // Show all appointments without date filtering
      break;
      
    case "Today":
      filteredconfirmAppointments = filteredconfirmAppointments.filter(
        (appointment) => {
          const appointmentTime = new Date(appointment.appointment_time);
          return appointmentTime >= todayStart && appointmentTime <= todayEnd;
        }
      );
      break;

    case "Upcoming":
      filteredconfirmAppointments = filteredconfirmAppointments.filter(
        (appointment) => {
          const appointmentTime = new Date(appointment.appointment_time);
          return appointmentTime >= now;
        }
      );
      break;

    case "This Week":
      const weekStart = new Date(todayStart);
      weekStart.setDate(todayStart.getDate() - todayStart.getDay()); // Start of week (Sunday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      filteredconfirmAppointments = filteredconfirmAppointments.filter(
        (appointment) => {
          const appointmentTime = new Date(appointment.appointment_time);
          return appointmentTime >= weekStart && appointmentTime < weekEnd;
        }
      );
      break;

    case "Last Week":
      const lastWeekEnd = new Date(todayStart);
      lastWeekEnd.setDate(todayStart.getDate() - todayStart.getDay()); // Start of this week = end of last week
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekEnd.getDate() - 7);
      
      filteredconfirmAppointments = filteredconfirmAppointments.filter(
        (appointment) => {
          const appointmentTime = new Date(appointment.appointment_time);
          return appointmentTime >= lastWeekStart && appointmentTime < lastWeekEnd;
        }
      );
      break;

    case "This Month":
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      filteredconfirmAppointments = filteredconfirmAppointments.filter(
        (appointment) => {
          const appointmentTime = new Date(appointment.appointment_time);
          return appointmentTime >= monthStart && appointmentTime <= monthEnd;
        }
      );
      break;

    case "Last Month":
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      
      filteredconfirmAppointments = filteredconfirmAppointments.filter(
        (appointment) => {
          const appointmentTime = new Date(appointment.appointment_time);
          return appointmentTime >= lastMonthStart && appointmentTime <= lastMonthEnd;
        }
      );
      break;
      
    default:
      break;
  }

  if (timeSlot) {
    const [startHour, startMinute] = timeSlot.start.split(":");
    const [endHour, endMinute] = timeSlot.end.split(":");

    filteredconfirmAppointments = filteredconfirmAppointments.filter(
      (appointment) => {
        const appointmentTime = new Date(appointment.appointment_time);
        const appointmentHours = appointmentTime.getHours();
        const appointmentMinutes = appointmentTime.getMinutes();

        const startTimeInMinutes =
          parseInt(startHour) * 60 + parseInt(startMinute);
        const endTimeInMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
        const appointmentTimeInMinutes =
          appointmentHours * 60 + appointmentMinutes;

        return (
          appointmentTimeInMinutes >= startTimeInMinutes &&
          appointmentTimeInMinutes < endTimeInMinutes
        );
      }
    );
  }

  return filteredconfirmAppointments;
};

const ConfirmedAppointments = ({ confirmappointments, onRefresh }) => {
  const [filter, setFilter] = useState("All");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_URL}/app/appointment/`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${localStorage.getItem("token")}`,
            },
            params: {
              appointment_id: id,
            },
          }
        );
        console.log(response.data.message);
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Confirmed Appointments received:", confirmappointments);
    console.log("Current filter:", filter);
    console.log("Filtered confirmed appointments:", filterconfirmAppointments(confirmappointments, filter, selectedTimeSlot));
  }, [confirmappointments, filter, selectedTimeSlot]);

  const filteredconfirmAppointments = filterconfirmAppointments(
    confirmappointments,
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
              const selectedOption = timeSlots.find(
                (slot) => slot.label === val
              );
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
            {filteredconfirmAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No confirmed appointments found for the selected filter
                </TableCell>
              </TableRow>
            ) : (
              filteredconfirmAppointments.map((appointment) => (
                <TableRow key={appointment.appointment_id} className="hover:bg-pink-50">
                  <TableCell className="text-center">
                    {appointment.customer?.user?.first_name || ''} {appointment.customer?.user?.last_name || ''}
                  </TableCell>
                  <TableCell className="text-center">
                    {appointment.services?.length > 0 ? (
                      appointment.services.map((service, index) => (
                        <div key={index}>{service.name}</div>
                      ))
                    ) : (
                      <span className="text-gray-400">No services</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {appointment.packages?.length > 0 ? (
                      appointment.packages.map((pkg, index) => (
                        <div key={index}>{pkg.name}</div>
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
                        variant="destructive"
                        onClick={() => handleDelete(appointment.appointment_id)}
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

export default ConfirmedAppointments;