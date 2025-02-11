import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


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
      <div className="flex flex-col justify-center items-center p-5 bg-white rounded-md shadow-md m-5 w-96">
        <form onSubmit={handleSubmit}>
          <h2 className="mt-0 text-2xl font-bold mb-4">Login</h2>
          <div className="flex flex-col mb-5">
            <label htmlFor="username" className="font-bold mb-1">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="p-2 text-base rounded-md border border-gray-300"
            />
          </div>
          <div className="flex flex-col mb-5">
            <label htmlFor="password" className="font-bold mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="p-2 text-base rounded-md border border-gray-300"
            />
          </div>
          <button
            className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

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
      <div className="flex flex-col justify-center items-center p-5 bg-white rounded-md shadow-md m-5 w-96">
        <form onSubmit={handleSubmit}>
          <h2 className="mt-0 text-2xl font-bold mb-4">Register</h2>
          <div className="flex flex-col mb-5">
            <label htmlFor="username" className="font-bold mb-1">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="p-2 text-base rounded-md border border-gray-300"
            />
          </div>
          <div className="flex flex-col mb-5">
            <label htmlFor="password" className="font-bold mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="p-2 text-base rounded-md border border-gray-300"
            />
          </div>
          <button
            className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
  );
};

// export const Auth = () => {
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <Login />
//       <Register />
//     </div>
//   );
// }; 

export default function Auth() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Login />
      <Register />
    </div>
  );
}
