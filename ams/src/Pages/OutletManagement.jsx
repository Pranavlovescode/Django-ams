import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Package,
  Scissors,
  Plus,
  Edit,
  Trash2,
  Clock,
  IndianRupee,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import LogoutWarning from "@/components/LogoutWarning";

const OutletManagement = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userType, setUserType] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  // Check user authentication and type
  useEffect(() => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      // Get user data from localStorage
      const authData = JSON.parse(localStorage.getItem("user") || "{}");
      const userTypeFromStorage = authData.user_type;
      setUserType(userTypeFromStorage);

      // Only allow admin and manager
      if (userTypeFromStorage !== "admin") {
        navigate("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch outlets based on user type
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/app/outlet/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        let outletsList = response.data.outlets;

        // // If manager, filter to only their assigned outlet
        // if (userType === "manager") {
        //   const authData = JSON.parse(
        //     localStorage.getItem("auth_data") || "{}"
        //   );
        //   const managedOutlets = outletsList.filter(
        //     (outlet) =>
        //       outlet.manager?.profile_id === authData.user_data?.profile_id
        //   );
        //   setOutlets(managedOutlets);

        //   // Auto-select the manager's outlet
        //   if (managedOutlets.length > 0) {
        //     setSelectedOutlet(managedOutlets[0]);
        //   }
        {
          // Admin can see all outlets
          setOutlets(outletsList);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching outlets:", error);
        setLoading(false);
      }
    };

    if (userType) {
      fetchOutlets();
    }
  }, [token, userType]);

  // Fetch services and packages when outlet is selected
  useEffect(() => {
    if (selectedOutlet) {
      fetchServicesAndPackages();
    }
  }, [selectedOutlet]);

  const fetchServicesAndPackages = async () => {
    try {
      // Fetch services for the selected outlet
      const servicesResponse = await axios.get(
        `${import.meta.env.VITE_URL}/app/services/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: {
            outlet_id: selectedOutlet.outlet_id,
          },
        }
      );
      setServices(servicesResponse.data.services);

      // Fetch packages for the selected outlet
      const packagesResponse = await axios.get(
        `${import.meta.env.VITE_URL}/app/packages/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: {
            outlet_id: selectedOutlet.outlet_id,
          },
        }
      );
      setPackages(packagesResponse.data.packages);
    } catch (error) {
      console.error("Error fetching services and packages:", error);
    }
  };

  const handleOutletChange = (outletId) => {
    const outlet = outlets.find((o) => o.outlet_id === outletId);
    setSelectedOutlet(outlet);

    // Update localStorage outlet for other components
    localStorage.setItem("outlet", JSON.stringify(outlet));
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_URL}/app/services/${serviceId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Refresh services list
      fetchServicesAndPackages();
      alert("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service. Please try again.");
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_URL}/app/packages/${packageId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Refresh packages list
      fetchServicesAndPackages();
      alert("Package deleted successfully!");
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Failed to delete package. Please try again.");
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {token ? (
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-4 pt-10">
          <LogoutWarning />
          <div className="max-w-7xl mx-auto">
            {/* Outlet Selector Card */}
            <Card className="bg-white/70 backdrop-blur-sm shadow-2xl border-0 mb-6">
              
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Outlet Management
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  {userType === "admin"
                    ? "Select and manage services & packages for any outlet"
                    : "Manage services & packages for your assigned outlet"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {outlets.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No outlets available</p>
                    {userType === "admin" && (
                      <Button
                        className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold"
                        onClick={() => navigate("/outlet-form")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Outlet
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Select Outlet:
                      </label>
                    </div>
                    <Select
                      value={selectedOutlet?.outlet_id}
                      onValueChange={handleOutletChange}
                      disabled={userType === "manager"} // Managers can't change outlet
                    >
                      <SelectTrigger className="w-full border-pink-200 focus:ring-pink-500">
                        <SelectValue placeholder="Select an outlet" />
                      </SelectTrigger>
                      <SelectContent>
                        {outlets.map((outlet) => (
                          <SelectItem
                            key={outlet.outlet_id}
                            value={outlet.outlet_id}
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-pink-500" />
                              {outlet.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Outlet Details */}
                    {selectedOutlet && (
                      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-5 mt-4 border border-pink-200">
                        <h3 className="text-lg font-semibold text-pink-700 mb-4">
                          Outlet Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-pink-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Address
                              </p>
                              <p className="text-sm text-gray-600">
                                {selectedOutlet.address}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-pink-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Contact
                              </p>
                              <p className="text-sm text-gray-600">
                                {selectedOutlet.contact_number}
                              </p>
                            </div>
                          </div>
                          {selectedOutlet.email && (
                            <div className="flex items-start gap-3">
                              <Mail className="h-5 w-5 text-pink-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Email
                                </p>
                                <p className="text-sm text-gray-600">
                                  {selectedOutlet.email}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-pink-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Hours
                              </p>
                              <p className="text-sm text-gray-600">
                                {selectedOutlet.opening_time} -{" "}
                                {selectedOutlet.closing_time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services and Packages Management */}
            {selectedOutlet && (
              <Card className="bg-white/70 backdrop-blur-sm shadow-2xl border-0">
                
                <CardHeader className="text-center space-y-4">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Services & Packages for {selectedOutlet.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Add, edit, or remove services and packages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger
                        value="services"
                        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                      >
                        <Scissors className="h-4 w-4" />
                        Services ({services.length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="packages"
                        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                      >
                        <Package className="h-4 w-4" />
                        Packages ({packages.length})
                      </TabsTrigger>
                    </TabsList>

                    {/* Services Tab */}
                    <TabsContent value="services" className="space-y-4">
                      <div className="flex justify-end">
                        <Link to="/service/new">
                          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Service
                          </Button>
                        </Link>
                      </div>

                      {services.length === 0 ? (
                        <div className="text-center py-12">
                          <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-600 mb-2">
                            No services found
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            Add your first service to get started
                          </p>
                          <Link to="/service/new">
                            <Button
                              variant="outline"
                              className="border-pink-300 text-pink-600 hover:bg-pink-50"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add First Service
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-pink-50 hover:bg-pink-50">
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Service Name
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Category
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Duration
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Price
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Status
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {services.map((service) => (
                                <TableRow
                                  key={service.service_id}
                                  className="hover:bg-pink-50/50 transition-colors"
                                >
                                  <TableCell className="text-center font-medium">
                                    {service.name}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant="outline"
                                      className="bg-purple-50 text-purple-700 border-purple-200"
                                    >
                                      {service.category || "Uncategorized"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      <Clock className="w-3 h-3 mr-1" />
                                      {(service.duration)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-700 border-green-200"
                                    >
                                      <IndianRupee className="w-3 h-3 mr-1" />
                                      {parseFloat(service.price).toFixed(2)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant={
                                        service.is_active
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={
                                        service.is_active ? "bg-green-500" : ""
                                      }
                                    >
                                      {service.is_active
                                        ? "Active"
                                        : "Inactive"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex justify-center gap-2">
                                      <Link
                                        to={`/service/edit/${service.service_id}`}
                                      >
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
                                        onClick={() =>
                                          handleDeleteService(
                                            service.service_id
                                          )
                                        }
                                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>

                    {/* Packages Tab */}
                    <TabsContent value="packages" className="space-y-4">
                      <div className="flex justify-end">
                        <Link to="/package/new">
                          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Package
                          </Button>
                        </Link>
                      </div>

                      {packages.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-600 mb-2">
                            No packages found
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            Add your first package to get started
                          </p>
                          <Link to="/package/new">
                            <Button
                              variant="outline"
                              className="border-pink-300 text-pink-600 hover:bg-pink-50"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add First Package
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-pink-50 hover:bg-pink-50">
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Package Name
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Category
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Services
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Duration
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Price
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Status
                                </TableHead>
                                <TableHead className="text-center font-semibold text-pink-700">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {packages.map((pkg) => (
                                <TableRow
                                  key={pkg.package_id}
                                  className="hover:bg-pink-50/50 transition-colors"
                                >
                                  <TableCell className="text-center font-medium">
                                    {pkg.name}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant="outline"
                                      className="bg-purple-50 text-purple-700 border-purple-200"
                                    >
                                      {pkg.category || "Uncategorized"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant="outline"
                                      className="bg-indigo-50 text-indigo-700 border-indigo-200"
                                    >
                                      {pkg.services?.length || 0} services
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      <Clock className="w-3 h-3 mr-1" />
                                      {(pkg.duration)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-700 border-green-200"
                                    >
                                      <IndianRupee className="w-3 h-3 mr-1" />
                                      {parseFloat(pkg.price).toFixed(2)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant={
                                        pkg.is_active ? "default" : "secondary"
                                      }
                                      className={
                                        pkg.is_active ? "bg-green-500" : ""
                                      }
                                    >
                                      {pkg.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex justify-center gap-2">
                                      <Link
                                        to={`/package/edit/${pkg.package_id}`}
                                      >
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
                                        onClick={() =>
                                          handleDeletePackage(pkg.package_id)
                                        }
                                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <LogoutWarning />
      )}
    </>
  );
};

export default OutletManagement;
