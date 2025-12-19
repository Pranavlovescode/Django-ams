import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Calendar,
  IndianRupee,
  PlusCircle,
  Users,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Define colors for pie chart segments
const COLORS = [
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

// Sample weekly data for revenue chart
const weeklyData = [
  { day: "Mon", revenue: 2400, appointments: 8 },
  { day: "Tue", revenue: 1398, appointments: 12 },
  { day: "Wed", revenue: 9800, appointments: 15 },
  { day: "Thu", revenue: 3908, appointments: 10 },
  { day: "Fri", revenue: 4800, appointments: 18 },
  { day: "Sat", revenue: 3800, appointments: 22 },
  { day: "Sun", revenue: 4300, appointments: 16 },
];

export default function Dashboard() {
  const [outletName, setOutletName] = useState("");
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [appointments, setAppointments] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    // Get outlet name and ID from local storage
    const outletData = JSON.parse(localStorage.getItem("outlet")) || {};
    const token = localStorage.getItem("token") || "";
    if(!token){
      navigate("/login");
    }
    setOutletName(outletData.name || "Salon Outlet");
    const today = new Date().toDateString();
    // Fetch today's appointment status breakdown from API
    const fetchAppointmentStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/api/appointment/get/${outletData.id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // console.log(response)
        const allAppointments = response.data;
        console.log(response.data);
        // Get today's date in string format to compare

        // Filter today's appointments
        const todayAppointments = allAppointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.time).toDateString();
          return appointmentDate === today;
        });
        // Count total appointments for today
        setTotalAppointments(todayAppointments.length);
        setAppointments(todayAppointments);

        // Count completed and pending appointments
        const completed = todayAppointments.filter(
          (apt) => apt.status === "completed"
        ).length;
        const pending = todayAppointments.filter(
          (apt) => apt.status === "pending"
        ).length;
        setCompletedAppointments(completed);
        setPendingAppointments(pending);

        // Get status breakdown
        const statusBreakdown = todayAppointments.reduce((acc, appointment) => {
          const status = appointment.status || "Unknown";
          console.log(status);
          if (!acc[status]) acc[status] = 0;
          acc[status]++;
          return acc;
        }, {});

        // Convert the status breakdown to an array for the pie chart
        const statusData = Object.entries(statusBreakdown).map(
          ([name, count]) => ({
            name,
            count,
          })
        );
        console.log(statusData);

        setAppointmentStatus(statusData);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    // Fetch today's revenue - this would need to be replaced with actual logic
    const fetchTodayRevenue = async () => {
      // Using the `/api/get-all-appointments-staff-without-filter` to get all the appointments
      const response = await axios.get(
        `http://localhost:5000/api/get-all-appointments-staff-without-filter`,
        {
          params: { outlet_id: outletId }, // Pass outlet_id as query param
        }
      );

      // Filtering today's appointments
      const appointments = response.data.service_appointments.filter(
        (appointment) => {
          const appointmentDate = new Date(appointment.time).toDateString();
          return appointmentDate === today;
        }
      );

      // Checking the appointments data for debugging purposes
      console.log("Appointments", appointments);

      // Calculating the revenue for the day (today)
      const revenue = appointments.reduce((acc, appointment) => {
        return (
          acc +
          appointment.service_id.reduce(
            (serviceAcc, service) => serviceAcc + service.price,
            0
          ) +
          appointment.package_id.reduce(
            (packageAcc, pkg) => packageAcc + pkg.price,
            0
          )
        );
      }, 0);

      // Consoling the final answer for debugging purposes
      console.log(revenue);
      // Setting the revenue to the state and showing it on the dashboard
      setTodayRevenue(revenue);
    };

    fetchTodayRevenue();
    fetchAppointmentStatus();
  }, []);
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-6 pt-10"
      style={{ backgroundSize: "cover" }}
    >
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between space-x-3">
          <div>
            <span className="flex flex-row items-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back!
              </h1>
              <h1 className="text-4xl">👋</h1>
            </span>
            <p className="text-lg text-gray-600">
              {outletName} Dashboard Overview
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-pink-100 text-pink-700 border-pink-200"
            >
              <Clock className="w-4 h-4 mr-1" />
              {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-pink-200 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Appointments Today
            </CardTitle>
            <Users className="h-5 w-5 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {totalAppointments}
            </div>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-purple-200 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Revenue
            </CardTitle>
            <IndianRupee className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              ₹{todayRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-200 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
            <Star className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {completedAppointments}
            </div>
            <Progress
              value={(completedAppointments / totalAppointments) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-orange-200 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {pendingAppointments}
            </div>
            <Progress
              value={(pendingAppointments / totalAppointments) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-pink-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Appointment Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {appointmentStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Weekly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-pink-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/book-appointment">
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white h-12">
                <PlusCircle className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
            <Link to="/appointments">
              <Button
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-50 h-12"
              >
                <Calendar className="mr-2 h-5 w-5" />
                View Appointments
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="outline"
                className="w-full border-indigo-200 hover:bg-indigo-50 h-12"
              >
                <Star className="mr-2 h-5 w-5" />
                Manage Services
              </Button>
            </Link>
            <Link to="/reports">
              <Button
                variant="outline"
                className="w-full border-orange-200 hover:bg-orange-50 h-12"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                View Reports
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
