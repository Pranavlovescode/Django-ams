import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Building2, Briefcase, Users } from "lucide-react";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    user_type: "employee", // Fixed as "staff"
    role: "Barber",
    phone_number: "",
    outlet_id: null,
    dob: "",
  });
  const [outlets, setOutlets] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, outlet_id: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/app/user/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("Employee added successfully", response.data);
      alert("Employee added successfully");
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  // Fetch outlets dynamically from the API
  useEffect(() => {
    const getOutlets = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/app/outlet/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        // console.log("outlet fetched",response.data.outlets)
        const outletOptions = response.data.outlets.map((outlet) => ({
          value: outlet.outlet_id,
          label: outlet.name,
        }));
        setOutlets(outletOptions);
      } catch (error) {
        console.log("Error while fetching outlets", error);
      }
    };

    getOutlets();
  }, []);

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      border: "2px solid #f9a8d4",
      borderRadius: "8px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#ec4899",
      },
      borderColor: state.isFocused ? "#ec4899" : "#f9a8d4",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-6 pt-10 flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-white/70 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Add New Employee
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Register a new staff member to your salon team
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="staff_name"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-pink-600" />
                  First Name
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter staff name"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="last_name"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-pink-600" />
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter staff name"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-pink-600" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="staff@example.com"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              {/* Mobile Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="staff_mobile_number"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-pink-600" />
                  Mobile Number
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender */}
            {/* <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  Gender
                </Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-12 px-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div> 
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-pink-600" />
                  Role
                </Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full h-12 px-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:ring-pink-500 focus:outline-none"
                >
                  <option>Barber</option>
                  <option>Hair Stylist</option>
                  <option>Nail Technician</option>
                  <option>Masseuse</option>
                  <option>Facialist</option>
                  <option>Receptionist</option>
                </select>
              </div>

              {/* Outlet Name - Half Width */}
              <div className="space-y-2">
                <Label
                  htmlFor="outletname"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-pink-600" />
                  Outlet
                </Label>
                <Select
                  id="outletname"
                  name="outletname"
                  options={outlets}
                  value={
                    outlets.find((opt) => opt.value === formData.outlet_id) ||
                    null
                  }
                  onChange={handleSelectChange}
                  styles={customSelectStyles}
                  placeholder="Select or search an outlet"
                  isSearchable={true}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dateofbirth"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-pink-600" />
                  Date of Birth
                </Label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Users className="w-5 h-5 mr-2" />
                Add Employee
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeForm;
