import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser, checkFullname, checkEmail, checkPhone } from "../../services/API/authApi";

const isValidFullname = (value) => {
  if (!value) return false;
  const koreanRegex = /^[가-힣0-9]+$/; // 숫자를 허용하도록 정규식 수정
  const englishRegex = /^[A-Za-z0-9]+$/; // 숫자를 허용하도록 정규식 수정
  if (koreanRegex.test(value)) {
    return value.length >= 2 && value.length <= 30;
  } else if (englishRegex.test(value)) {
    return value.length >= 6 && value.length <= 30;
  }
  return false;
};

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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const referrerFromURL = searchParams.get("referer_id") || "";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkMessage, setCheckMessage] = useState({ fullname: "", email: "", phone: "" });
  const [isFullnameChecked, setIsFullnameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPhoneChecked, setIsPhoneChecked] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      phone: "",
      referrer: referrerFromURL,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await registerUser(dispatch, navigate, values);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
        formik.setErrors({ phone: errorMessage });
      }
    },
  });

  const handleCheckFullname = async () => {
    try {
      const result = await checkFullname(formik.values.fullname);
      setCheckMessage({ ...checkMessage, fullname: result.message });
      setIsFullnameChecked(result.message === "사용 가능한 이름입니다.");
      if (result.message === "사용 가능한 이름입니다.") {
        formik.setErrors({ ...formik.errors, fullname: '' });
      }
    } catch (error) {
      setCheckMessage({ ...checkMessage, fullname: "중복 확인 중 오류가 발생했습니다." });
    }
  };

  const handleCheckEmail = async () => {
    try {
      const result = await checkEmail(formik.values.email);
      setCheckMessage({ ...checkMessage, email: result.message });
      setIsEmailChecked(result.message === "사용 가능한 이메일입니다.");
      if (result.message === "사용 가능한 이메일입니다.") {
        formik.setErrors({ ...formik.errors, email: '' });
      }
    } catch (error) {
      setCheckMessage({ ...checkMessage, email: "중복 확인 중 오류가 발생했습니다." });
    }
  };

  const handleCheckPhone = async () => {
    try {
      const result = await checkPhone(formik.values.phone);
      setCheckMessage({ ...checkMessage, phone: result.message });
      setIsPhoneChecked(result.message === "사용 가능한 전화번호입니다.");
      if (result.message === "사용 가능한 전화번호입니다.") {
        formik.setErrors({ ...formik.errors, phone: '' });
      }
    } catch (error) {
      setCheckMessage({ ...checkMessage, phone: "중복 확인 중 오류가 발생했습니다." });
    }
  };

  const isAllChecked = () => {
    return (
      isFullnameChecked &&
      isEmailChecked &&
      isPhoneChecked &&
      !formik.errors.fullname &&
      !formik.errors.email &&
      !formik.errors.phone
    );
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <form onSubmit={formik.handleSubmit}>
          <div className="wrap-login100">
            <span className="login100-form-title mt-5">회원가입</span>
            <div className="wrap-input100">
              <div className="input-group">
                <input
                  name="fullname"
                  className="input100"
                  type="text"
                  placeholder="이름을 입력 후 확인 버튼을 클릭해 주세요"
                  onChange={(e) => {
                    formik.handleChange(e);
                    setIsFullnameChecked(false);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullname}
                  disabled={isFullnameChecked}
                />
                <button type="button" onClick={handleCheckFullname} disabled={isFullnameChecked}>
                  확인
                </button>
              </div>
              {checkMessage.fullname && <div className="text-info">{checkMessage.fullname}</div>}
              {formik.errors.fullname && formik.touched.fullname && (
                <div className="text-danger">{formik.errors.fullname}</div>
              )}
            </div>

            <div className="wrap-input100">
              <div className="input-group">
                <input
                  className="input100"
                  type="text"
                  placeholder="이메일을 입력 후 확인 버튼을 클릭해 주세요"
                  name="email"
                  onChange={(e) => {
                    formik.handleChange(e);
                    setIsEmailChecked(false);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  disabled={isEmailChecked}
                />
                <button type="button" onClick={handleCheckEmail} disabled={isEmailChecked}>
                  확인
                </button>
              </div>
              {checkMessage.email && <div className="text-info">{checkMessage.email}</div>}
              {formik.errors.email && formik.touched.email && (
                <div className="text-danger">{formik.errors.email}</div>
              )}
            </div>

            <div className="wrap-input100">
              <div className="input-group">
                <input
                  className="input100"
                  type="text"
                  placeholder="전화번호(숫자만) 입력 후 확인 버튼을 클릭해 주세요"
                  name="phone"
                  onChange={(e) => {
                    formik.handleChange(e);
                    setIsPhoneChecked(false);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  disabled={isPhoneChecked}
                />
                <button type="button" onClick={handleCheckPhone} disabled={isPhoneChecked}>
                  확인
                </button>
              </div>
              {checkMessage.phone && <div className="text-info">{checkMessage.phone}</div>}
              {formik.errors.phone && formik.touched.phone && (
                <div className="text-danger">{formik.errors.phone}</div>
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
                placeholder="추천인 (이메일 또는 ID)"
                name="referrer"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.referrer}
                disabled={referrerFromURL ? true : false}
              />
              {formik.errors.referrer && formik.touched.referrer && (
                <div className="text-danger">{formik.errors.referrer}</div>
              )}
            </div>

            <button className="login100-form-btn" type="submit" disabled={!isAllChecked()}>
              회원가입
            </button>

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
