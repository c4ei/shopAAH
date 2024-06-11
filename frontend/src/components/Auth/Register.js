import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../services/API/authApi";

// Fullname 유효성 검사 함수
const isValidFullname = (value) => {
  if (!value) return false;
  const koreanRegex = /^[가-힣]+$/;
  const englishRegex = /^[A-Za-z]+$/;
  if (koreanRegex.test(value)) {
    return value.length >= 2 && value.length <= 30;
  } else if (englishRegex.test(value)) {
    return value.length >= 6 && value.length <= 30;
  }
  return false;
};

// Yup을 사용한 유효성 검사 스키마
const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("(*) 이름을 입력하세요.")
    .test(
      "is-valid-fullname",
      "이름은 한글 2자 이상, 영문 6자 이상이어야 합니다.",
      isValidFullname
    ),
  email: Yup.string()
    .required("(*) 이메일을 입력하세요.")
    .email("유효한 이메일을 입력하세요."),
  password: Yup.string()
    .required("(*) 비밀번호를 입력하세요.")
    .min(6, "비밀번호는 6자 이상, 32자 이하여야 합니다.")
    .max(32, "비밀번호는 6자 이상, 32자 이하여야 합니다."),
  phone: Yup.string()
    .required("(*) 전화번호를 입력하세요.")
    .matches(/^\d{11}$/, "유효한 전화번호를 입력하세요."),
  referrer: Yup.string()
    .test(
      "is-valid-referrer",
      "추천인은 유효한 ID 또는 이메일이어야 합니다.",
      (value) => {
        if (!value) return true;
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isValidID = /^\d+$/.test(value);
        return isValidEmail || isValidID;
      }
    )
    .optional(),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      phone: "",
      referrer: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await registerUser(dispatch, navigate, values);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
        formik.setErrors({ phone: errorMessage }); // phone 필드에 오류 메시지 표시
      }
    },
  });

  return (
    <div className="limiter">
      <div className="container-login100">
        <form onSubmit={formik.handleSubmit}>
          <div className="wrap-login100">
            <span className="login100-form-title mt-5">회원가입</span>
            <div className="wrap-input100">
              <input
                name="fullname"
                className="input100"
                type="text"
                placeholder="이름"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullname}
              />
              {formik.errors.fullname && formik.touched.fullname && (
                <div className="text-danger">{formik.errors.fullname}</div>
              )}
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                placeholder="이메일"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-danger">{formik.errors.email}</div>
              )}
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="password"
                placeholder="비밀번호"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password && (
                <div className="text-danger">{formik.errors.password}</div>
              )}
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                placeholder="전화번호"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.errors.phone && formik.touched.phone && (
                <div className="text-danger">{formik.errors.phone}</div>
              )}
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                placeholder="추천인 (이메일 또는 ID)"
                name="referrer"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.referrer}
              />
              {formik.errors.referrer && formik.touched.referrer && (
                <div className="text-danger">{formik.errors.referrer}</div>
              )}
            </div>

            <button className="login100-form-btn" type="submit">회원가입</button>

            <div className="text-center py-4">
              <span className="txt1">이미 계정이 있으신가요?</span>
              &nbsp;
              <NavLink to="/signin" className="txt2">
                로그인
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
