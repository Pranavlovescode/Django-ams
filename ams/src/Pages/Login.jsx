import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Make sure shadcn components are installed & imported correctly
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/auth/login/`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.logged_in_user));
        localStorage.setItem("outlet", JSON.stringify(data.outlet));
        navigate("/");
      } else {
        alert("Login successful but no token received.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("OTP");
    }, 120000);
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 p-4"
      style={{ backgroundSize: "cover" }}
    >
      <Card className="w-full max-w-md bg-white/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-pink-700">
            Salon Login
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
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-pink-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
            <Button
              variant="default"
              className="mt-3 bg-pink-700 text-white hover:bg-pink-600"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center bg-pink-50">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-pink-700 underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
