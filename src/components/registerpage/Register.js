import React, { useState } from "react";
import Footer from "../Layout/registerlayout/footer/Footer";
import { registerUser } from "../../api/apiClient";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        "confirm-password": formData.confirmPassword,
        fullname: formData.fullname,
      });

      if (response.status === 200 || response.status === 201) {
        setMessage("A confirmation email has been sent to your email address.");
      } else {
        setError("Failed to register. Please try again.");
      }
    } catch (err) {
      setError(
        "Error: " + (err.response?.data?.message || "Something went wrong.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 items-center">
      <div className="w-full max-w-md p-8 rounded-lg bg-gray-800 bg-opacity-50 backdrop-blur-sm mt-10 mb-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Your Account
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none placeholder-gray-400 transition duration-200"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none placeholder-gray-400 transition duration-200"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none placeholder-gray-400 transition duration-200 pr-10"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none placeholder-gray-400 transition duration-200 pr-10"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {message && (
            <div className="p-3 bg-green-900 bg-opacity-50 text-green-300 rounded-lg text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-900 bg-opacity-50 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-red-400 hover:text-blue-300">
            Sign in
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
