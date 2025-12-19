import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Scissors,
  Save,
  X,
  Clock,
  IndianRupee,
  FileText,
  Building,
} from "lucide-react";

const ServiceForm = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState({
    name: "",
    price: "",
    duration: "",
    outlets: [],
    description: "",
    category: "",
  });
  const [allOutlets, setAllOutlets] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_URL}/app/services/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
              params: {
                service_id: id,
              },
            }
          );
          console.log("Fetched service data:", response.data); // Debugging

          setServiceData({
            name: response.data.service.name, // Use the correct field name as per your backend
            price:
              response.data.service.price.$numberDecimal ||
              response.data.service.price, // Handle numberDecimal
            duration: response.data.service.duration,
            description: response.data.service.description || "",
            outlets: response.data.service.outlets || [],
            category: response.data.service.category || "",
          });
        } catch (error) {
          console.error("Error fetching service data:", error);
        }
      };

      fetchService(); // Call the async function
    }
  }, [id]); // Only re-run the effect if the `id` changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // if (name == "duration") {
    //   newValue = value.length === 5 ? `${value}:00` : "value";
    // }
    setServiceData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.patch(
          `${import.meta.env.VITE_URL}/app/services/`,
          serviceData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
            params: {
              service_id: id,
            },
          }
        );
      } else {
        console.log("serviceData", serviceData);
        await axios.post(
          `${import.meta.env.VITE_URL}/app/services/`,
          serviceData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }
      navigate("/services");
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  useEffect(() => {
    const fetchAllOutlets = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/app/outlet/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log("Fetched outlets:", response.data); // Debugging
        const outlets = response.data.outlets.map((outlet) => ({
          label: outlet.name,
          value: outlet.outlet_id,
        }));
        setAllOutlets(outlets);
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };

    fetchAllOutlets();
  }, []);

  const handlePackageChange = (selectedOptions) => {
    console.log("Selected options:", selectedOptions); // Debugging
    // console.log("outlet",outlets)
    const optionsArray = Array.isArray(selectedOptions)
      ? selectedOptions
      : selectedOptions
      ? [selectedOptions]
      : [];
    console.log("Options array:", optionsArray); // Debugging
    const selectedOutlets = optionsArray.map((option) => option.value);
    console.log("Selected outlets:", selectedOutlets); // Debugging
    setServiceData((prevState) => ({
      ...prevState,
      outlets: selectedOutlets,
    }));
  };
  // Custom styles for react-select components
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
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#fce7f3",
      borderRadius: "6px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#be185d",
      fontWeight: "500",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#be185d",
      "&:hover": {
        backgroundColor: "#ec4899",
        color: "white",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-4 flex items-center justify-center pt-10">
      <Card className="w-full max-w-3xl bg-white/70 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {id ? "Edit Service" : "Add New Service"}
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {id
              ? "Update service details below"
              : "Create a new service for your salon"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Scissors className="w-4 h-4 text-pink-600" />
                  Service Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={serviceData.name}
                  onChange={handleInputChange}
                  placeholder="Enter service name"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <IndianRupee className="w-4 h-4 text-pink-600" />
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  value={serviceData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="duration"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-pink-600" />
                Duration
              </Label>
              <Input
                id="duration"
                type="text"
                name="duration"
                value={serviceData.duration}
                onChange={handleInputChange}
                placeholder="Enter duration (e.g., 30)"
                className="h-12 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-pink-600" />
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={serviceData.description}
                onChange={handleInputChange}
                placeholder="Enter service description"
                className="min-h-[100px] border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500 resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building className="w-4 h-4 text-pink-600" />
                Available Outlets
              </Label>
              <Select
                isMulti
                className="basic-multi-select"
                options={allOutlets}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                value={allOutlets.filter(
                  (outlet) =>
                    Array.isArray(serviceData.outlets) &&
                    serviceData.outlets.includes(outlet.value)
                )}
                onChange={handlePackageChange}
                placeholder="Select outlets where this service is available..."
                styles={customSelectStyles}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Save className="w-5 h-5 mr-2" />
                {id ? "Update Service" : "Save Service"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/services")}
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

export default ServiceForm;
