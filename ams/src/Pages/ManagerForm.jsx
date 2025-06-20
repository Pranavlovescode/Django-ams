
import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
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
import { UserCog, Mail, Phone, User, Building, Lock, Plus } from "lucide-react";

const ManagerForm = () => {
  const [formData, setFormData] = useState({
    staff_name: "",
    email: "",
    category: "manager",
    password: "",
    staff_mobile_number: "",
    outlet_id: "", // Assuming outlet_id is also a part of the manager data
  });
  const [isUserFound, setIsUserFound] = useState(true); 
  const navigate = useNavigate();


const fetchMobileNumbers = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const response = await axios.get(
        `http://localhost:5000/api/get-users-staff?staff_mobile_number=${inputValue}`
      );
      const users = response.data;
  
      if (users.length > 0) {
        setIsUserFound(true);
        return users.map((user) => ({
          label: `${user.staff_name} (${user.staff_mobile_number})`,
          value: user.staff_mobile_number,
          userData: user,
        }));
      } else {
        setIsUserFound(false);
        return [];
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsUserFound(false);
      return [];
    }
  };
    // Custom message when no options are available
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
// Navigate to Add User page
const handleAddUser = () => {
    navigate("/add-user");
  };

  // Handle change when a mobile number is selected
  const handleMobileChange = (selectedOption) => {
    if (selectedOption?.userData) {
      setFormData({
        ...formData,
        staff_name: selectedOption.userData.staff_name,
        email: selectedOption.userData.email || "",
        staff_mobile_number: selectedOption.userData.staff_mobile_number,
        outlet_id: selectedOption.userData.outlet_id || "", 
      });
    } else {
      setFormData({
        ...formData,
        staff_mobile_number: selectedOption?.value || "",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send request to update user to manager and set the password
      await axios.post("http://localhost:5000/api/update-to-manager", {
        staff_mobile_number: formData.staff_mobile_number,
        password: formData.password, // Update password for the user
      });
      alert("Manager updated successfully");
      navigate("/success"); // Navigate to a success page after submission
    } catch (error) {
      console.error("Error updating manager", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-6 pt-10 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white/70 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <UserCog className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Promote to Manager
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Select an existing staff member and promote them to manager role
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-600" />
                Search Staff by Mobile Number
              </Label>
              <div className="relative">
                <AsyncSelect
                  cacheOptions
                  loadOptions={fetchMobileNumbers}
                  onChange={handleMobileChange}
                  placeholder="Enter mobile number to search..."
                  isClearable
                  noOptionsMessage={noOptionsMessage}
                  value={
                    formData.staff_mobile_number
                      ? { label: formData.staff_mobile_number, value: formData.staff_mobile_number }
                      : null
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight: '48px',
                      border: '2px solid #f9a8d4',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#ec4899',
                      },
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: '#9ca3af',
                    }),
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  Staff Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  className="h-12 border-2 border-gray-200 bg-gray-50"
                  value={formData.staff_name}
                  placeholder="Name will auto-fill"
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-600" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  className="h-12 border-2 border-gray-200 bg-gray-50"
                  value={formData.email}
                  placeholder="Email will auto-fill"
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-600" />
                Manager Password *
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                placeholder="Enter secure password for manager account"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outlet_id" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building className="w-4 h-4 text-pink-600" />
                Outlet ID
              </Label>
              <Input
                id="outlet_id"
                type="text"
                name="outlet_id"
                className="h-12 border-2 border-gray-200 bg-gray-50"
                value={formData.outlet_id}
                placeholder="Outlet ID will auto-fill"
                readOnly
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <UserCog className="w-5 h-5 mr-2" />
                Promote to Manager
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerForm;
