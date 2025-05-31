// Action types for user authentication (Login/Register)

// Login action types
export const Login_Request = "LOGIN_REQUEST";
export const Login_Success = "LOGIN_SUCCESS";
export const Login_Fail = "LOGIN_FAIL";

// Register action types
export const Register_User_Request = "REGISTER_USER_REQUEST";
export const Register_User_Success = "REGISTER_USER_SUCCESS";
export const Register_User_Fail = "REGISTER_USER_FAIL";

// Other general actions
export const Change_Type = "CHANGE_TYPE";   // Action for changing user type (if any)
export const Latest_Message = "LATEST_MESSAGE";  // Action for latest message or notification
export const Login_User_Image = "LOGIN_USER_IMAGE";  // Action to store user's image

// Additional actions for managing user info or other actions
export const Get_Login_Success = "GET_LOGIN_SUCCESS";  // Action when login is successful (getting user data)
