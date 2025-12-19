import React, { useState } from "react";
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
import { UserPlus, Mail, Phone, User,Calendar } from "lucide-react";

const UserPage = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    email: "",
    user_type: "customer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await axios.post(`${import.meta.env.VITE_URL}/app/user/`, formData,{
        headers:{
          "Authorization":`Token ${token}`
        }
      });
      console.log("The form response", response.data)
      console.log("User added successfully");
      alert("User added successfully");
      navigate("/users");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-6 pt-10  flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white/70 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Add New User
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Register a new customer to your salon management system
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  First Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-600" />
                  Mobile Phone
                </Label>
                <Input
                  id="phone_number"
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-600" />
                  Date of Birth
                </Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  placeholder="Enter date of birth"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-600" />
                Email Address (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add User to System
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
