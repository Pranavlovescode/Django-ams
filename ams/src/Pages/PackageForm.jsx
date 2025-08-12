import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Save, X, Clock, IndianRupee, Tag, Layers } from "lucide-react";

const PackageForm = () => {
  const { id } = useParams();  
  const navigate = useNavigate();
  
  // State for package data
  const [packageData, setPackageData] = useState({
    package_name: '', 
    price: '',
    estimated_time: '',  
    category: '',
    services: [],
  });
  
  // State for fetching available services
  const [availableServices, setAvailableServices] = useState([]);
  
  // State for token management
  const [token, setToken] = useState({
    token: "",
    user_data: {}
  });

  // Fetch available services and package data if editing
  useEffect(() => {
    // Fetch available services
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        console.log("redposnse",response)
        // Map services for react-select (label, value format)
        const servicesOptions = response.data.map(service => ({
          label: service.service_name,
          value: service._id,
        }));
        console.log(servicesOptions)
        setAvailableServices(servicesOptions);  // Set the available services
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();

    // If editing an existing package, fetch the package data
    // if (id) {
    //   const fetchPackage = async () => {
    //     const existingPackage = await axios.get(`http://localhost:5000/api/packages/${id}`);
    //     console.log("existingPackage",existingPackage.data)
    //     if (existingPackage) {
    //       setPackageData(existingPackage.data);
    //     }
    //   };
    //   fetchPackage();
    // }
    if (id) {
      const fetchPackage = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/packages/${id}`);
          const existingPackage = response.data;

          // Set package data, including selected services
          setPackageData({
            ...existingPackage,
            services: existingPackage.services.map(service => service._id),  // Set services to an array of IDs
          });
        } catch (error) {
          console.error('Error fetching package:', error);
        }
      };
      fetchPackage();
    }

    // Check for token expiration
    const storedToken = JSON.parse(localStorage.getItem("auth_data"));
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken.token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("auth_data");
          setToken({ token: null, user_data: {} });
        }
      } catch (error) {
        console.log(error);      
      }
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle service selection using react-select
  const handleServiceChange = (selectedOptions) => {
    // Get selected services' IDs
    const selectedServices = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setPackageData((prevState) => ({
      ...prevState,
      services: selectedServices,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update existing package
        await axios.put(`http://localhost:5000/api/packages/${id}`, packageData);
      } else {
        // Create new package
        await axios.post('http://localhost:5000/api/packages', packageData);
      }
      navigate('/package-master');  // Redirect after submission
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };
  // Custom styles for react-select components
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      border: '2px solid #f9a8d4',
      borderRadius: '8px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#ec4899',
      },
      borderColor: state.isFocused ? '#ec4899' : '#f9a8d4',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#fce7f3',
      borderRadius: '6px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#be185d',
      fontWeight: '500',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#be185d',
      '&:hover': {
        backgroundColor: '#ec4899',
        color: 'white',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
    }),
  };

  return (
    <>
      {token ? (
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-4 flex items-center justify-center">
          <Card className="w-full max-w-3xl bg-white/70 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {id ? 'Edit Package' : 'Create New Package'}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                {id ? 'Update package details below' : 'Create a comprehensive service package for your salon'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="package_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Package className="w-4 h-4 text-pink-600" />
                      Package Name
                    </Label>
                    <Input
                      id="package_name"
                      type="text"
                      name="package_name"
                      value={packageData.package_name}
                      onChange={handleInputChange}
                      placeholder="Enter package name"
                      className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-pink-600" />
                      Price (₹)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      name="price"
                      value={packageData.price}
                      onChange={handleInputChange}
                      placeholder="Enter package price"
                      className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="estimated_time" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-pink-600" />
                      Estimated Time
                    </Label>
                    <Input
                      id="estimated_time"
                      type="text"
                      name="estimated_time"
                      value={packageData.estimated_time}
                      onChange={handleInputChange}
                      placeholder="e.g., 2 hours"
                      className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-pink-600" />
                      Category
                    </Label>
                    <Input
                      id="category"
                      type="text"
                      name="category"
                      value={packageData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Bridal, Premium"
                      className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-pink-600" />
                    Included Services
                  </Label>
                  <Select
                    isMulti
                    options={availableServices}
                    value={availableServices.filter(service => 
                      packageData.services.includes(service.value))}
                    onChange={handleServiceChange}
                    placeholder="Select services to include in this package..."
                    styles={customSelectStyles}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="submit"
                    className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {id ? 'Update Package' : 'Create Package'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/package-master')}
                    className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-lg transition-all duration-200"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <LogoutWarning />
      )}
    </>
  );
};

export default PackageForm;
