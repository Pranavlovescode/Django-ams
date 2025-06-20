import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
// import { statesAndDistricts } from "@/Data/list";
import { useEffect, useState } from "react";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import axios from "axios";
import { Building2, Mail, MapPin, Phone, Hash, ExternalLink } from "lucide-react";

export default function OutletForm() {
  const [selectedState, setSelectedState] = useState("");
  // const [selectedDistrict, setSelectedDistrict] = useState("");
  const [formData, setFormData] = useState({
    outlet_name: "",
    email: "",
    address: "",
    telephone_number: "",
    manager_id:''
  });
  useEffect(() => {
    console.log(selectedState);
  }, [selectedState]);
  // console.log(statesAndDistricts.states[0].districts);
  // console.log(district);
  const handleFormData = async(e) => {
    e.preventDefault();
    console.log("Outlet formData",formData);
    const response = await axios.post('http://localhost:5000/api/outlet', formData,{
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth_data')).token}`
      }
    });
    console.log("New outlet:", response.data);
    alert("New outlet created successfully");
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-6 pt-10 flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-white/70 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Create New Outlet
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Register a new salon outlet location in your management system
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleFormData} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="outlet_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-pink-600" />
                  Outlet Name
                </Label>
                <Input
                  onChange={(e)=>setFormData({...formData, outlet_name:e.target.value})}
                  id="outlet_name"
                  name="outlet_name"
                  placeholder="SalonX - Main Branch"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-600" />
                  Outlet Email
                </Label>
                <Input
                  onChange={(e)=>setFormData({...formData, email:e.target.value})}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="outlet@salonx.com"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-600" />
                Complete Address
              </Label>
              <Input
                onChange={(e)=>setFormData({...formData, address:e.target.value})}
                id="address"
                name="address"
                type="text"
                placeholder="123, Main Street, City, State"
                className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_map_link" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-pink-600" />
                Google Maps Link
              </Label>
              <Input
                onChange={(e)=>setFormData({...formData, google_map_link:e.target.value})}
                id="google_map_link"
                name="google_map_link"
                type="url"
                placeholder="https://maps.google.com/..."
                className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-pink-600" />
                  Pincode
                </Label>
                <Input
                  onChange={(e)=>setFormData({...formData, pincode:e.target.value})}
                  id="pincode"
                  name="pincode"
                  type="number"
                  placeholder="123456"
                  maxLength={6}
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telephone_number" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-600" />
                  Telephone Number
                </Label>
                <Input
                  onChange={(e)=>setFormData({...formData, telephone_number:e.target.value})}
                  id="telephone_number"
                  name="telephone_number"
                  type="tel"
                  placeholder="1234567890"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Create Outlet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
