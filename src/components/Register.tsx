import { sign } from "crypto";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup } from "../api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const {userInfo}= useSelector((state:RootState)=>state.auth)

  const navigate = useNavigate();

  useEffect(()=>{
    if (userInfo) {
      navigate('/pdfExtractor')
    }
  },[userInfo])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleSignUp();
    console.log("Form submitted:", { name, email, password });
  };

  const handleSignUp = async () => {
    try {
      const userData = {
        name,
        email,
        password,
      };
  
      const response = await signup(userData);
      console.log(response, "res");
      console.log(response.status, "res");
  
      // Check for success status
      if (response.status == 201) {
        toast.success(response?.message); // Assuming the response has this structure
        navigate('/login'); // Navigate to the login page
      } else {
        // Handle cases where response is not 201
        const errorMessage = response?.data?.message || 'Signup failed. Please try again.';
        toast.error(errorMessage);
      }
      
    } catch (error: any) {
      console.log(error); // Corrected from console..log to console.log
    //   const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    //   toast.error(errorMessage); 
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 ">
      <h2 className="text-2xl font-bold text-center mb-5">Register</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-green-950 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
        <div className="flex m-3 justify-center">
          <p className="font-sans text-sm mr-2">Already have an account..! </p>
          <button
            className="text-blue-600 underline text-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
