import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import edit from "../assets/edit _button.svg";
import LogoutWarning from "@/Components/LogoutWarning";
import { jwtDecode } from "jwt-decode";
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
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Trash2,
  Edit,
  Clock,
  IndianRupee,
  Layers,
} from "lucide-react";

const PackageMaster = () => {
  const [packages, setPackages] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch the packages from the backend on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/app/packages/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
            params:{
              outlet_id: JSON.parse(localStorage.getItem("outlet"))?.outlet_id || null,
            }
          }
        );
        console.log("Fetched packages:", response.data);
        setPackages(response.data.packages); // Set the fetched packages
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  // Delete a package by ID
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/packages/${id}`);
        setPackages(packages.filter((pkg) => pkg._id !== id)); // Update state after deletion
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  return (
    <>
      {token ? (
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-4 pt-10">
          <div className="max-w-7xl mx-auto">
            <Card className="bg-white/70 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Package Master
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Manage your salon packages, pricing, and included services
                </CardDescription>
                <div className="flex items-center justify-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-pink-100 text-pink-700"
                  >
                    {packages.length} Packages Available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-end">
                  <Link to="/add-package">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Package
                    </Button>
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-pink-50 hover:bg-pink-50">
                        <TableHead className="text-center font-semibold text-pink-700">
                          Name
                        </TableHead>
                        <TableHead className="text-center font-semibold text-pink-700">
                          Price
                        </TableHead>
                        <TableHead className="text-center font-semibold text-pink-700">
                          Time
                        </TableHead>
                        <TableHead className="text-center font-semibold text-pink-700">
                          Category
                        </TableHead>
                        <TableHead className="text-center font-semibold text-pink-700">
                          Services
                        </TableHead>
                        <TableHead className="text-center font-semibold text-pink-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.length > 0 ? (
                        packages.map((pkg) => (
                          <TableRow
                            key={pkg._id}
                            className="hover:bg-pink-50/50 transition-colors"
                          >
                            <TableCell className="text-center font-medium">
                              {pkg.package_name}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                <IndianRupee className="w-3 h-3 mr-1" />
                                {pkg.price}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                {pkg.estimated_time}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200"
                              >
                                {pkg.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {pkg.services.map((service, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-pink-100 text-pink-700"
                                  >
                                    {service.service_name}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-2">
                                <Link to={`/edit-package/${pkg._id}`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-blue-50 hover:border-blue-300"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(pkg._id)}
                                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Package className="w-12 h-12 text-gray-300" />
                              <p className="text-lg font-medium">
                                No packages found
                              </p>
                              <p className="text-sm">
                                Add your first package to get started
                              </p>
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
      ) : (
        <LogoutWarning />
      )}
    </>
  );
};

export default PackageMaster;
