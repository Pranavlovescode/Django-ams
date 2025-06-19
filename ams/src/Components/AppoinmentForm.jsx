import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";

const AppointmentForm = ({ appointment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    servicesId: [],
    appointmentTime: "",
    packagesId: [],
    userId: 0,
    outletId: 0,
    customer_mobile_phone: "",
  });

  const [allServices, setAllServices] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  // Fetch services and packages on mount
  useEffect(() => {
    const fetchServicesAndPackages = async () => {
      try {
        const [servicesResponse, packagesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_URL}/api/services/get`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_URL}/api/packages/get`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const servicesOptions = servicesResponse.data.map((service) => ({
          label: service.name,
          id: service.id,
          service_price: Number(service.price),
        }));

        const packagesOptions = packagesResponse.data.map((pkg) => ({
          label: pkg.name,
          id: pkg.id,
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
    const outlet_id = outlet ? outlet.id : null;
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
      setFormData((prev) => ({
        ...prev,
        ...appointment,
        servicesId: appointment.servicesId?.map((s) => s.id) || [],
        packagesId: appointment.packagesId?.map((p) => p.id) || [],
        appointmentTime: appointment.appointmentTime || "",
        customer_mobile_phone: appointment.customer_mobile_phone || "",
        userId: appointment.userId || 0,
      }));
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

  // Load mobile numbers dynamically
  const fetchMobileNumbers = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const response = await axios.get(
          `${import.meta.env.VITE_URL}/api/user/mobile?mobile_number=${inputValue}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && !Array.isArray(response.data)) {
        const user = response.data;
        return [
          {
            label: `${user.username || "Unknown"} (${user.mobileNumber})`,
            value: user.mobileNumber,
            userData: user,
          },
        ];
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((user) => ({
          label: `${user.name || "Unknown"} (${user.mobileNumber})`,
          value: user.mobileNumber,
          userData: user,
        }));
      } else {
        return [];
      }
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
      <button
          type="button"
          className="p-2 bg-green-500 text-white rounded-md w-full text-center"
          onClick={handleAddUser}
      >
        Add New User
      </button>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Pre-select services and packages
  const selectedServices = allServices.filter((service) =>
      formData.servicesId.includes(service.id)
  );
  const selectedPackages = allPackages.filter((pkg) =>
      formData.packagesId.includes(pkg.id)
  );

  return (
      <div className="p-4">
        <h1 className="text-xl mb-4">Appointment Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <AsyncSelect
                  cacheOptions
                  loadOptions={fetchMobileNumbers}
                  onChange={handleMobileChange}
                  placeholder="Customer Mobile Phone"
                  isClearable
                  defaultOptions={false}
                  noOptionsMessage={noOptionsMessage}
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

            <input
                type="datetime-local"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className="p-2 border rounded-md"
                required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Services:</label>
            <Select
                isMulti
                options={allServices}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.id}
                value={allServices.filter((service) =>
                    formData.servicesId.includes(service.id)
                )}
                onChange={handleServiceChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Packages:</label>
            <Select
                isMulti
                options={allPackages}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.id}
                value={allPackages.filter((pkg) =>
                    formData.packagesId.includes(pkg.id)
                )}
                onChange={handlePackageChange}
            />
          </div>

          <div className="mt-4 flex justify-between">
            <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-md"
            >
              Save Appointment
            </button>
            <button
                type="button"
                className="p-2 bg-red-500 text-white rounded-md"
                onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
  );
};

export default AppointmentForm;
