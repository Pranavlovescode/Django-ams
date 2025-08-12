import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../Data/service';
import edit from "../assets/edit _button.svg";  // Your edit icon
import axios from 'axios'; // Axios to handle API calls
import { useState, useEffect } from 'react';
import LogoutWarning from '@/components/LogoutWarning';
import { jwtDecode } from 'jwt-decode';
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
import { Scissors, Plus, Trash2, Edit, Clock, IndianRupee } from "lucide-react";

const ServiceMaster = () => {
  const [services, setServices] = useState([]);
  const token = localStorage.getItem("token")
  const outletId = JSON.parse(localStorage.getItem("outlet"))?.outlet_id || null;
  // const [services, setServices] = useState(services);
  // const handleDelete = (id) => {
  // const updatedServices = services.filter(service => service.id !== id);
  // setServices(updatedServices);
  //   };
  useEffect(() => {
    console.log(token);
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("auth_data");
        setToken({ token: "", user_data: {} });
      }
    } catch (error) {
      console.log(error);
    }
  }, [])
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/app/services/`,{
          headers: {
            Authorization: `Token ${token}`,
          },
          params:{
            outlet_id:outletId
          }
          
        });
        console.log("fetched services",response.data)
        setServices(response.data.services);
      } catch (error) {
        console.error("There was an error fetching services!", error);
      }
    };

    fetchServices();
  }, []);    // Delete service
    const handleDelete = async (id) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this service? This action cannot be undone."
      );
      if (confirmDelete) {
        try {
          await axios.delete(`${import.meta.env.VITE_URL}/app/services/`,{
            headers: {
              Authorization: `Token ${token}`,
            },
            params:{
              service_id: id,
            }
          });
          setServices(services.filter(service => service.service_id !== id));
        } catch (error) {
          console.error('Error deleting service:', error);
        }
      }
    };  return (
    <>
      {token ? (
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-4 pt-10">
          <div className="max-w-7xl mx-auto">
            <Card className="bg-white/70 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Scissors className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Service Master
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Manage your salon services, pricing, and duration
                </CardDescription>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                    {services.length} Services Available
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex justify-end">
                  <Link to="/add-service">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Service
                    </Button>
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-pink-50 hover:bg-pink-50">
                        <TableHead className="text-center font-semibold text-pink-700">Service Name</TableHead>
                        <TableHead className="text-center font-semibold text-pink-700">Price</TableHead>
                        <TableHead className="text-center font-semibold text-pink-700">Duration</TableHead>
                        <TableHead className="text-center font-semibold text-pink-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.length > 0 ? (
                        services.map((service) => (
                          <TableRow key={service._id} className="hover:bg-pink-50/50 transition-colors">
                            <TableCell className="text-center font-medium">{service.name}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <IndianRupee className="w-3 h-3 mr-1" />
                                {service.price}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <Clock className="w-3 h-3 mr-1" />
                                {service.duration} mins
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-2">
                                <Link to={`/edit-service/${service.service_id}`}>
                                  <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(service.service_id)}
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
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                              <Scissors className="w-12 h-12 text-gray-300" />
                              <p className="text-lg font-medium">No services found</p>
                              <p className="text-sm">Add your first service to get started</p>
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

export default ServiceMaster;
