// /frontend/src/services/API/authApi.js
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutUserFailed,
  logoutUserStart,
  logoutUserSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "../../redux/authSlice";
import { DOMAIN } from "../../utils/settings/config";
import axios from "axios";

export const loginUser = async (dispatch, navigate, user) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(`${DOMAIN}/api/v1/users/login`, user);
    dispatch(loginSuccess(response.data));
    navigate("/");
  } catch (err) {
    dispatch(loginFailed(err.response?.data?.message || "로그인 중 오류가 발생했습니다."));
  }
};

export const login_goo_id = async (dispatch, navigate, email) => {
  // console.log("Email in login_goo_id:", email); // 디버깅을 위해 추가
  dispatch(loginStart());
  try {
    const response = await axios.post(`${DOMAIN}/api/v1/users/login_goo_id`, { email });
    dispatch(loginSuccess(response.data));
    navigate("/");
  } catch (err) {
    dispatch(loginFailed(err.response?.data?.message || "로그인 중 오류가 발생했습니다."));
  }
};

export const registerUser = async (dispatch, navigate, user) => {
  dispatch(registerStart());
  try {
    await axios.post(`${DOMAIN}/api/v1/users/register`, user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (err) {
    console.error("Error during registration:", err.response?.data); // 상세 로그 추가
    dispatch(registerFailed(err.response?.data?.message || "회원가입 중 오류가 발생했습니다."));
  }
};

// Fullname duplication check
export const checkFullname = async (fullname) => {
  try {
    const response = await axios.post(`${DOMAIN}/api/v1/users/check-fullname`, { fullname });
    return response.data;
  } catch (error) {
    throw new Error("이름 확인 중 오류가 발생했습니다.");
  }
};

// Email duplication check
export const checkEmail = async (email) => {
  try {
    const response = await axios.post(`${DOMAIN}/api/v1/users/check-email`, { email });
    return response.data;
  } catch (error) {
    throw new Error("Error checking email.");
  }
};

// Phone duplication check
export const checkPhone = async (phone) => {
  try {
    const response = await axios.post(`${DOMAIN}/api/v1/users/check-phone`, { phone });
    return response.data;
  } catch (error) {
    throw new Error("Error checking phone.");
  }
};

// Referrer validation
export const validateReferrer = async (referrer) => {
  try {
    const response = await axios.post(`${DOMAIN}/api/v1/users/validate-referrer`, { referrer });
    return response.data;
  } catch (error) {
    throw new Error("Error validating referrer.");
  }
};

export const logoutUser = async (dispatch, id, accessToken, navigate, axiosJWT) => {
  dispatch(logoutUserStart());
  try {
    await axiosJWT.post(`${DOMAIN}/api/v1/users/logout`, id, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(logoutUserSuccess());
    localStorage.clear();
    navigate("/");
  } catch (err) {
    dispatch(logoutUserFailed(err.response?.data?.message || "로그아웃 중 오류가 발생했습니다."));
  }
};
