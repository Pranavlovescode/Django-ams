import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const EmployeeTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/api/auth/user-get-all/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // console.log(response.data);
        setUsers(() => response.data.users.filter((user) => user.role != "customer")); // Setting the users fetched from the backend
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.user.first_name || user.user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-6 pt-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Employee Directory
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg mt-1">
                    Manage and view all staff members
                  </CardDescription>
                </div>
              </div>
              <Link to="/employeeform">
                <Button className="h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add New Employee
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Search Results</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Status</p>
                  <Badge className="mt-1 bg-green-500 hover:bg-green-600">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-pink-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-50 hover:to-purple-50">
                    <TableHead className="font-bold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-600" />
                        Name
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-pink-600" />
                        Mobile Number
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-pink-600" />
                        Email
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.profile_id}
                        className="hover:bg-pink-50/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.user.first_name ? user.user.first_name.charAt(0).toUpperCase() : "?"}
                            </div>
                            {user.user.first_name || "N/A"} {user.user.last_name || ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {user.phone_number || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {user.user.email || "N/A"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="w-12 h-12 text-gray-300" />
                          <p className="text-lg font-medium">No employees found</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeTable;
