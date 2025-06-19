import React, { useEffect, useState } from "react";
import newlogo from "../assets/newlogo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./sidebar.css";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const token = localStorage.getItem("token");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleExtra = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setUserData(JSON.parse(sessionStorage.getItem("auth_data")));
  }, []);

  const handleLogoutProcess = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/auth/logout/`,{},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("Logout Information", response.data);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("outlet");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>      {/* Top nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-200 z-50">
        <div className="px-3 py-3 lg:py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            {/* Menu Toggle & Logo */}
            <div className="flex items-center justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="sm:hidden hover:bg-pink-100 focus:ring-2 focus:ring-pink-200"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </Button>
              <a href={`/`} className="flex px-2">
                <img src={newlogo} alt="logo" className="w-14 h-14 object-contain" />
              </a>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 ring-2 ring-pink-200">
                      <AvatarImage
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="user"
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {JSON.parse(localStorage.getItem('user')).user.username || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {JSON.parse(localStorage.getItem('user')).profile_id || "sd2kf-kjd4f-jk4"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/employeeform">Add Employee</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/managerform">Add Manager</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/add-user">Add User</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogoutProcess}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen pt-20 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } border-r border-pink-200 bg-white/95 backdrop-blur-md sm:translate-x-0 shadow-xl`}
        style={{ width: "18rem" }}
        aria-label="Sidebar"
      >
        {/* Close button */}
        <div className="flex justify-end items-center px-4 pb-2">
          {isMenuOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMenu}
              className="hover:bg-pink-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </Button>
          )}
        </div>

        {/* Sidebar Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow-md">
            <img src={newlogo} alt="logo" className="w-20 h-20 object-contain" />
          </div>
          <h2 className="mt-3 text-xl font-bold text-pink-700">Salon Manager</h2>
        </div>

        {/* Navigation Links */}
        <div className="h-full overflow-y-auto custom-scrollbar px-4">
          <nav className="space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-pink-600 uppercase tracking-wider">
                Main
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/dashboard">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  Dashboard
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/appointments">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 2v2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-1V2h-2v2H8V2H6v2H3Zm-1 6V8h14v2H5Zm0 2h14v10H5V10Zm2 3v2h2v-2H7Zm4 0v2h6v-2h-6Z" />
                  </svg>
                  Appointments
                  <Badge variant="secondary" className="ml-auto bg-pink-100 text-pink-700">
                    3
                  </Badge>
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/payment">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H3Zm0 2h18v3H3V7Zm0 4h18v5H3v-5Z" />
                  </svg>
                  Payment
                  <Badge variant="secondary" className="ml-auto bg-pink-100 text-pink-700">
                    2
                  </Badge>
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/reports">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="m16 13-3.5 3.5-2-2L8 17" />
                  </svg>
                  Reports
                </Link>
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Services Section */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-pink-600 uppercase tracking-wider">
                Services
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/package-master">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4Z" />
                    <path d="M12 22V12" />
                    <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
                    <path d="m7.5 4.27 9 5.15" />
                  </svg>
                  Package
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/services">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 7h16M4 12h8m-8 5h16"
                    />
                  </svg>
                  Services
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/book-appointment">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 4v17h18V4h-3V2h-2v2H8V2H6v2H3Zm2 2v2h14V6H5Zm0 4v9h14v-9H5Zm5 2h2v5h-2v-5Z" />
                  </svg>
                  Book Appointment
                </Link>
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Management Section */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-pink-600 uppercase tracking-wider">
                Management
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/outlet-form">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                    <path d="M2 7h20" />
                    <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
                  </svg>
                  Outlets
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/users">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Users
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-pink-100 hover:text-pink-700 text-left"
                asChild
              >
                <Link to="/get-employee">
                  <svg
                    className="w-5 h-5 mr-3"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Employees
                </Link>
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Footer Menu: Profile & Logout */}
            <div className="space-y-1 pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start h-10 hover:bg-blue-100 hover:text-blue-700 text-left"
                asChild
              >
                <Link to="/profilepage">
                  <svg
                    className="w-5 h-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.5 15H7a4 4 0 0 0-4 4v2"></path>
                    <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"></path>
                    <circle cx="10" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </Link>
              </Button>

              <Button
                variant="ghost"
                onClick={handleLogoutProcess}
                className="w-full justify-start h-10 hover:bg-red-100 hover:text-red-700 text-left"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" x2="9" y1="12" y2="12"></line>
                </svg>
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
