// /frontend/src/components/Auth/Login.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/API/authApi";
import "./Auth.css";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = { email, password };
    await loginUser(dispatch, navigate, user);
    navigate("/"); // 로그인 후 메인 페이지로 이동
  };
  // const handleLogin = async () => {
  //   const user = { email, password };
  //   try {
  //     const response = await loginUser(dispatch, navigate, user);
  //     // console.log("Login Response:", response);
  
  //     if (response && response.status === "success") {
  //       localStorage.setItem("token", response.token);
  //       const user = { email, password };
  //       await loginUser(dispatch, navigate, user);
  //       navigate("/manage");
  //     } 
  //     // else { console.error("Login failed:", response ? response.message : "No response from server"); }
  //   } catch (error) {
  //     console.error("Login Error:", error);
  //   }
  // };

  const google_clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("https://shop.c4ei.net/api/v1/users/googlelogin", {
        token: credentialResponse.credential
      });
      // console.log("Backend Response:", response.data);
  
      if (response.data.status === "success") {
        // console.log("Login Successful, Token:", response.data.token);
        localStorage.setItem("token", response.data.token);
        navigate("/manage");
      } 
      // else { console.error("Google Login failed:", response.data.message || "Unknown error"); }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };
  
  const handleGoogleError = () => {
    console.log("Login failed");
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <span className="login100-form-title mt-5">Login</span>
          <div className="d-flex justify-content-center pb-5"></div>

          <div className="wrap-input100">
            <input
              className="input100"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="wrap-input100">
            <input
              className="input100"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login100-form-btn" onClick={handleLogin}>
            Login
          </button>

          <div className="text-center py-4">
            <span className="txt1">Create an account?</span>
            &nbsp;
            <NavLink to="/register" className="txt2">
              Click
            </NavLink>
          </div>

          <div className="text-center py-4">
            <GoogleOAuthProvider clientId={google_clientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
