import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../redux/action"; // Correct path
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Correct path for accessing authReducer state
  const { isAuth, userImage, error } = useSelector((store) => store.authReducer); 

  console.log("🔹 Auth Status:", isAuth);
  console.log("🔹 User Image:", userImage);
  console.log("🔹 Login Error:", error);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userObj = {
      email: email.trim(),  // ✅ Trim spaces
      password,
    };

    console.log("🟢 Sending User Object:", userObj);

    dispatch(LoginUser(userObj, navigate)); // Dispatch login action
  };

  // ✅ Auto redirect after login
  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");  // 🔥 Login hone ke baad dashboard pe bhej do
    }
  }, [isAuth, navigate]);

  return (
    <form className="max-w-sm mx-auto m-36" onSubmit={handleSubmit}>
      <div className="max-w-sm mx-auto">
        <h1 className="text-3xl font-bold mb-4">Please Login</h1>
      </div>
      {error && <p className="text-red-500">{error}</p>}  {/* 🔴 Error message show */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="name@example.com"
          required
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Password"
          required
        />
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5"
      >
        Submit
      </button>

      {isAuth && (
        <div className="mt-5">
          <p className="text-green-600">✅ Login Successful!</p>
          <img src={userImage || "/default-avatar.png"} alt="User Avatar" width="100" />
        </div>
      )}
    </form>
  );
};
