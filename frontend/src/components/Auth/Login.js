// /frontend/src/components/Auth/Login.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/API/authApi";
import "./Auth.css";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode"; // JWT 디코딩을 위한 라이브러리
import axios from "axios"; // HTTP 요청을 위한 라이브러리

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = { email, password };
    loginUser(dispatch, navigate, user);
  };

  // Google 클라이언트 ID를 환경 변수에서 가져옴
  const google_clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // Google OAuth 로그인 성공 시 호출되는 함수
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // JWT 디코딩
      const decoded = jwt_decode(credentialResponse.credential);
      const email = decoded.email;
      const fullname = decoded.name;

      // 디버깅용 이메일 출력
      console.log("Decoded JWT:", decoded);
      console.log("Email:", email , " / fullname :" , fullname);

      // 이메일을 백엔드로 전송
      const response = await axios.post("https://shop.c4ei.net/api/v1/users/googlelogin", { email, fullname });
      console.log("백엔드 응답:", response.data);
      // 백엔드 응답이 "login"인 경우 홈 페이지로 리디렉션
      if (response.data === "login") {
        alert("login ok");
        document.location.href = "/";
      } else {
        // 로그인 성공 후 홈 페이지로 리디렉션 // msg - login , reg
        alert("reg ok");
        document.location.href = "/";
      }

      // 추가 로직이 필요한 경우 여기에 작성
    } catch (error) {
      console.error("JWT 디코딩 중 오류 발생:", error);
    }
  };

  // Google OAuth 로그인 실패 시 호출되는 함수
  const handleGoogleError = () => {
    console.log("로그인 실패");
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

          {/* Google OAuth 로그인 버튼 */}
          <div className="text-center py-4">
            <GoogleOAuthProvider clientId={google_clientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess} // 로그인 성공 시 호출되는 함수
                onError={handleGoogleError} // 로그인 실패 시 호출되는 함수
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
