import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

// Reusable Form Component for Login and Register
const AuthForm = ({ title, onSubmit, username, setUsername, password, setPassword, buttonText }) => (
  <div className="flex flex-col justify-center items-center p-8 bg-white rounded-xl shadow-lg m-5 w-96 border border-gray-200">
    <form onSubmit={onSubmit} className="w-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
      
      {/* Username Field */}
      <div className="flex flex-col mb-4">
        <label htmlFor="username" className="font-medium text-gray-700 mb-1">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username"
          className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
        />
      </div>

      {/* Password Field */}
      <div className="flex flex-col mb-6">
        <label htmlFor="password" className="font-medium text-gray-700 mb-1">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition duration-200"
      >
        {buttonText}
      </button>
    </form>
  </div>
);

// Login Component
const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });
      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthForm
      title="Login"
      onSubmit={handleSubmit}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      buttonText="Login"
    />
  );
};

// Register Component
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      alert("Registration Completed! Now login.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthForm
      title="Register"
      onSubmit={handleSubmit}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      buttonText="Register"
    />
  );
};

// Auth Page
export default function Auth() {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <Login />
        <Register />
      </div>
    </div>
  );
}
