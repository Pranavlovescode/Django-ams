import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Make sure shadcn components are correctly installed & imported
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SignUp() {
  const [username, setusername] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const navigate = useNavigate();

  const handleAddUser = async () => {
    if (
      username.trim() &&
      phone_number.trim() &&
      password.trim() &&
      address.trim() &&
      confirmPassword.trim() &&
      dob.trim() &&
      first_name.trim() &&
      last_name.trim()
    ) {
      if (password === confirmPassword) {
        const userDetails = {
          username,
          phone_number,
          password,
          address,
          dob,
          first_name,
          last_name,
        };
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_URL}/api/auth/signup/`,
            userDetails,
            { withCredentials: true }
          );
          const { token } = response.data;
          localStorage.setItem("token", token);
          alert("User added successfully!");
          setusername("");
          setPhone_number("");
          setPassword("");
          setConfirmPassword("");
          setAddress("");
          setDob("");
          setFirst_name("");
          setLast_name("");
          navigate("/");
        } catch (error) {
          console.error("Error adding user:", error.message);
        }
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Please enter all details");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 p-4"
      style={{ backgroundSize: "cover" }}
    >
      <Card className="w-full max-w-md bg-white/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-pink-700">
            Salon Appointment
          </CardTitle>
          <CardDescription className="text-center">
            Manage your appointments effortlessly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-pink-700">
                Username
              </label>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-pink-700">
                First Name
              </label>
              <Input
                placeholder="Enter your first name"
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-pink-700">
                Last Name
              </label>
              <Input
                placeholder="Enter your last name"
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-pink-700">
                Phone Number
              </label>
              <Input
                placeholder="Enter your phone number"
                value={phone_number}
                onChange={(e) => setPhone_number(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-pink-700">
                Date of Birth
              </label>
              <Input
                placeholder="YYYY-MM-DD"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-pink-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-pink-700">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Re-type your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-pink-700">
                Address
              </label>
              <Input
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button
              variant="default"
              onClick={handleAddUser}
              className="mt-3 bg-pink-700 text-white hover:bg-pink-600"
            >
              Sign Up
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center bg-pink-50">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-500 transition duration-100 hover:text-blue-600 active:text-blue-700"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;
