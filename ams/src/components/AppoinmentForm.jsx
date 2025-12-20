import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
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
import { CalendarDays, Phone, Package, Scissors, Plus, Save, X } from "lucide-react";

const AppointmentForm = ({ appointment, onSave, onCancel }) => {
  
  const [allServices, setAllServices] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const navigate = useNavigate();
  const outlet_id = JSON.parse(localStorage.getItem("outlet"))?.outlet_id || null;
  const token = localStorage.getItem("token") || "";

  const [formData, setFormData] = useState({
    servicesId: [],
    appointmentTime: "",
    packagesId: [],
    userId: 0,
    outletId: 0,
    customer_mobile_phone: "",
  });

  // Fetch services and packages on mount
  useEffect(() => {
    const fetchServicesAndPackages = async () => {
      try {
        const [servicesResponse, packagesResponse] = await Promise.all([
          await axios.get(`${import.meta.env.VITE_URL}/app/services/`, {
            headers: { Authorization: `Token ${token}` },
            params: { outlet_id: outlet_id },
          }),
          axios.get(`${import.meta.env.VITE_URL}/app/packages/`, {
            headers: { Authorization: `Token ${token}` },
            params: { outlet_id: outlet_id },
          }),
        ]);
        console.log(servicesResponse.data)
        const servicesOptions = servicesResponse.data.services.map((service) => ({
          label: service.name,
          id: service.service_id,
          service_price: Number(service.price),
        }));
        console.log(packagesResponse.data)
        const packagesOptions = packagesResponse.data.packages.map((pkg) => ({
          label: pkg.name,
          id: pkg.package_id,
          pkg_price: Number(pkg.price),
        }));

        setAllServices(servicesOptions);
        setAllPackages(packagesOptions);
      } catch (error) {
        console.error("Error fetching services or packages:", error);
      }
    };

    fetchServicesAndPackages();
  }, [token]);

  // Set outlet ID from localStorage
  useEffect(() => {
    const outlet = JSON.parse(localStorage.getItem("outlet"));
    const outlet_id = outlet ? outlet.outlet_id : null;
    if (outlet_id) {
      setFormData((prev) => ({
        ...prev,
        outletId: outlet_id,
      }));
    }
  }, []);

  // Pre-fill form if editing an appointment
  useEffect(() => {
    if (appointment) {
      console.log("Received appointment for editing:", appointment);
      
      // Convert ISO datetime to datetime-local format (YYYY-MM-DDTHH:mm)
      let localDateTime = "";
      const timeField = appointment.appointmentTime || appointment.appointment_time;
      
      if (timeField) {
        const date = new Date(timeField);
        // Format to YYYY-MM-DDTHH:mm for datetime-local input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      }
      
      // Extract service IDs from nested service objects
      const serviceIds = appointment.servicesId?.map((s) => s.id || s.service_id) || 
                        appointment.services?.map((s) => s.id || s.service_id) || [];
      
      // Extract package IDs from nested package objects
      const packageIds = appointment.packagesId?.map((p) => p.id || p.package_id) || 
                        appointment.packages?.map((p) => p.id || p.package_id) || [];
      
      // Get customer info - handle both direct userId and nested customer object
      const customerId = appointment.userId || 
                        appointment.customer?.profile_id || 
                        appointment.customer?.id || 0;
      
      const customerPhone = appointment.customer_mobile_phone || 
                           appointment.customer?.phone_number || "";
      
      setFormData((prev) => ({
        ...prev,
        servicesId: serviceIds,
        packagesId: packageIds,
        appointmentTime: localDateTime,
        customer_mobile_phone: customerPhone,
        userId: customerId,
        outletId: appointment.outletId || appointment.outlet?.outlet_id || prev.outletId,
      }));
      
      console.log("Form data set to:", {
        servicesId: serviceIds,
        packagesId: packageIds,
        appointmentTime: localDateTime,
        customer_mobile_phone: customerPhone,
        userId: customerId,
      });
    }
  }, [appointment]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle services selection
  const handleServiceChange = (selectedOptions) => {
    const selectedServices = selectedOptions
        ? selectedOptions.map((option) => option.id)
        : [];
    setFormData((prev) => ({
      ...prev,
      servicesId: selectedServices,
    }));
  };

  // Handle packages selection
  const handlePackageChange = (selectedOptions) => {
    const selectedPackages = selectedOptions
        ? selectedOptions.map((option) => option.id)
        : [];
    setFormData((prev) => ({
      ...prev,
      packagesId: selectedPackages,
    }));
  };

  // Load mobile numbers dynamically with debouncing
  const fetchMobileNumbers = async (inputValue) => {
    // Require at least 3 digits for search
    if (!inputValue || inputValue.length < 3) return [];
    
    try {
      const response = await axios.get(
          `${import.meta.env.VITE_URL}/app/user/mobile/`,
          { 
            headers: { Authorization: `Token ${token}` },
            params: { mobile_number: inputValue }
          }
      );

      // Backend now returns an array directly
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((user) => ({
          label: `${user.name} (${user.mobileNumber})`,
          value: user.mobileNumber,
          userData: user,
        }));
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // Handle mobile number selection
  const handleMobileChange = (selectedOption) => {
    if (selectedOption?.userData) {
      setFormData((prev) => ({
        ...prev,
        customer_mobile_phone: selectedOption.userData.mobileNumber,
        userId: selectedOption.userData.id,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        customer_mobile_phone: selectedOption?.value || "",
      }));
    }
  };

  // Navigate to Add User page
  const handleAddUser = () => {
    navigate("/add-user");
  };
  // Custom "No Options" message with Add User button
  const noOptionsMessage = () => (
    <div className="p-3 text-center">
      <Button
        type="button"
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-md w-full flex items-center justify-center gap-2"
        onClick={handleAddUser}
      >
        <Plus className="w-4 h-4" />
        Add New User
      </Button>
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert datetime-local to ISO string for backend
    const submitData = {
      ...formData,
      appointmentTime: formData.appointmentTime 
        ? new Date(formData.appointmentTime).toISOString()
        : ""
    };
    
    console.log("Submitting appointment data:", submitData);
    onSave(submitData);
  };

  // Pre-select services and packages
  const selectedServices = allServices.filter((service) =>
      formData.servicesId.includes(service.id)
  );
  const selectedPackages = allPackages.filter((pkg) =>
      formData.packagesId.includes(pkg.id)
  );
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
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-6 pt-10 flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-white/70 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <CalendarDays className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {appointment ? 'Edit Appointment' : 'Book New Appointment'}
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {appointment ? 'Update appointment details below' : 'Schedule a new appointment for your customer'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-600" />
                  Customer Mobile Number
                </Label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={fetchMobileNumbers}
                  onChange={handleMobileChange}
                  placeholder="Search by mobile number..."
                  isClearable
                  defaultOptions={false}
                  noOptionsMessage={noOptionsMessage}
                  styles={customSelectStyles}
                  value={
                    formData.customer_mobile_phone
                      ? {
                          label: formData.customer_mobile_phone,
                          value: formData.customer_mobile_phone,
                        }
                      : null
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentTime" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-pink-600" />
                  Appointment Date & Time
                </Label>
                <Input
                  id="appointmentTime"
                  type="datetime-local"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-pink-600" />
                Select Services
              </Label>
              <Select
                isMulti
                options={allServices}
                getOptionLabel={(option) => `${option.label} - ₹${option.service_price}`}
                getOptionValue={(option) => option.id}
                value={allServices.filter((service) =>
                  formData.servicesId.includes(service.id)
                )}
                onChange={handleServiceChange}
                placeholder="Choose services..."
                styles={customSelectStyles}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Package className="w-4 h-4 text-pink-600" />
                Select Packages
              </Label>
              <Select
                isMulti
                options={allPackages}
                getOptionLabel={(option) => `${option.label} - ₹${option.pkg_price}`}
                getOptionValue={(option) => option.id}
                value={allPackages.filter((pkg) =>
                  formData.packagesId.includes(pkg.id)
                )}
                onChange={handlePackageChange}
                placeholder="Choose packages..."
                styles={customSelectStyles}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Save className="w-5 h-5 mr-2" />
                {appointment ? 'Update Appointment' : 'Save Appointment'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={onCancel}
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
  );
};

export default AppointmentForm;
