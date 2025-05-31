import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../redux/action";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [registerUser, setRegisterUser] = useState({
    userImage: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterUser((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 Prevent empty form submission
    if (!registerUser.username || !registerUser.email || !registerUser.password) {
      alert("Please fill all required fields!");
      return;
    }

    console.log("Registering User:", registerUser);
    dispatch(RegisterUser(registerUser, navigate)); // ✅ Now passing `navigate`
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-3 m-20">
      <h1 className="text-2xl font-bold text-center mb-5">CREATE ACCOUNT</h1>

      {/* User Image Input */}
      <label htmlFor="user_avatar" className="block mb-2 text-sm font-medium text-gray-900">
        Upload user profile
      </label>
      <input
        id="user_avatar"
        name="userImage"
        value={registerUser.userImage}
        onChange={handleChange}
        type="text"
        placeholder="Enter user image link"
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
      />

      {/* Username Input */}
      <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
        User Name
      </label>
      <input
        type="text"
        id="username"
        name="username"
        value={registerUser.username}
        onChange={handleChange}
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
        placeholder="Username.."
        required
      />

      {/* Email Input */}
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
        Your Email
      </label>
      <input
        type="email"
        name="email"
        value={registerUser.email}
        onChange={handleChange}
        id="email"
        placeholder="Email"
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
        required
      />

      {/* Password Input */}
      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
        Your Password
      </label>
      <input
        type="password"
        name="password"
        value={registerUser.password}
        onChange={handleChange}
        id="password"
        placeholder="Password"
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-5"
        required
      />

      {/* Terms and Conditions Checkbox */}
      <div className="flex items-start mb-5">
        <input id="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" required />
        <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900">
          I agree with the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            terms and conditions
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full">
        Register new account
      </button>
    </form>
  );
};
