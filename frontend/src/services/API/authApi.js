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
    dispatch(loginFailed(err));
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
    dispatch(registerFailed(err.response?.data.message || "An error occurred"));
  }
};

export const logoutUser = async (
  dispatch,
  id,
  accessToken,
  navigate,
  axiosJWT
) => {
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
    dispatch(logoutUserFailed(err));
  }
};
