import axios from "axios";
import {
  Login_Fail,
  Login_Success,
  Register_User_Fail,
  Register_User_Request,
  Register_User_Success,
} from "./actionType";

// ✅ Correct API URL setup
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";  // 🔥 5001 Set Kar Diya
console.log("✅ Backend API URL:", API_URL);

// ✅ LOGIN USER FUNCTION
export const LoginUser = (userObj, navigate) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userObj, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // 🔥 Fix CORS issue for authentication
    });

    const userData = res.data;
    console.log("🟢 Login Response:", userData);

    if (!userData.token) {
      console.error("🔴 Login Failed: No token received");
      alert("Login Failed! Please check credentials.");
      return;
    }

    // ✅ Store user image properly
    const userImage = userData.existinguser?.userImage || "/default-avatar.png";
    console.log("🟢 User Image:", userImage);

    // ✅ Save token & userImage
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userImage", userImage);

    dispatch({ type: Login_Success, payload: userData, isAuth: true });

    alert("✅ Login Successful!");
    navigate("/interviewType");
  } catch (error) {
    console.error("🔴 Authentication Error:", error.response?.data || error.message);
    
    // Show proper error message
    alert("Login Failed: " + (error.response?.data?.error || "Unknown error"));

    dispatch({ type: Login_Fail });
  }
};

// ✅ REGISTER USER FUNCTION
export const RegisterUser = (userData, navigate) => async (dispatch) => {
  dispatch({ type: Register_User_Request });

  try {
    const res = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // 🔥 Fix authentication
    });

    console.log("🟢 Registration Response:", res.data);

    dispatch({ type: Register_User_Success, payload: res.data });
    alert("✅ Registration Successful!");
    navigate("/login");
  } catch (error) {
    console.error("🔴 Registration Error:", error.response?.data || error.message);

    // Show proper error message
    alert("Registration Failed: " + (error.response?.data?.error || "Unknown error"));

    dispatch({ type: Register_User_Fail });
  }
};
