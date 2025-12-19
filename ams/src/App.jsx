import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "@/Pages/Login";
import Signup from "@/Pages/Signup";
import AppointmentPage from "@/Pages/AppoinmentPage";
import EditAppointmentPage from "@/Pages/EditAppoinmentPage";
import BookAppointmentPage from "@/Pages/BookAppoinmentPage";
import Sidebar from "@/components/Sidebar";
import PackageForm from "@/Pages/PackageForm";
import PackageMaster from "@/Pages/PackageMaster";
import ServiceMaster from "@/Pages/ServiceMaster";
// import EditService from "./Pages/EditService";
import ServiceForm from "@/Pages/ServiceForm";
import OtpverifyPage from "@/Pages/OtpverifyPage";
import PaymentPage from "@/Pages/PaymentPage";
import PaymentForm from "@/components/PaymentForm";
import UserPage from "@/Pages/UserPage";
import UserTable from "@/Pages/UserTable";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Reports from "@/Pages/Reports";
import OutletForm from "@/Pages/OutletForm";
import ProfilePage from "@/Pages/ProfilePage";
import Dashboard from "@/Pages/Dashboard";
// import { path } from 'path';
import EmployeeForm from "@/Pages/EmployeeForm";
import ManagerForm from "@/Pages/ManagerForm";
import EmployeeTable from "@/Pages/EmployeeTable";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const noSidebarRoutes = [ "/signup", "/verify-otp","/login"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Navigate to login if no token and not on public routes
    if (!token && !noSidebarRoutes.includes(location.pathname)) {
      navigate("/login");
    }

    // Navigate to dashboard if token exists and on public routes
    if (token && noSidebarRoutes.includes(location.pathname) && location.pathname !== "/verify-otp") {
      navigate("/");
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {!noSidebarRoutes.includes(location.pathname) && <Sidebar />}
        <div
          className={
            noSidebarRoutes.includes(location.pathname) ? "" : "lg:ml-72 mt-14"
          }
        >
          <Routes>
            {/* Public Routes - available without token */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OtpverifyPage />} />

            {/* Protected Routes - require token */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments" element={<AppointmentPage />} />
            <Route
              path="/edit-appointment/:id"
              element={<EditAppointmentPage />}
            />
            <Route
              path="/book-appointment"
              element={<BookAppointmentPage />}
            />
            <Route path="/package-master" element={<PackageMaster />} />
            <Route path="/add-package" element={<PackageForm />} />
            <Route path="/edit-package/:id" element={<PackageForm />} />
            <Route path="/services" element={<ServiceMaster />} />
            <Route path="/add-service" element={<ServiceForm />} />
            <Route path="/edit-service/:id" element={<ServiceForm />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-form" element={<PaymentForm />} />
            <Route path="/add-user" element={<UserPage />} />
            <Route path="/users" element={<UserTable />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/outlet-form" element={<OutletForm />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/employeeform" element={<EmployeeForm />} />
            <Route path="/managerform" element={<ManagerForm />} />
            <Route path="/get-employee" element={<EmployeeTable />} />
          </Routes>
        </div>
      </LocalizationProvider>
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
