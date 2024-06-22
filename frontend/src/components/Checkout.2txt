// /shop.c4ei.net/frontend/src/components/Checkout.js
import { Link } from "react-router-dom"; // Link 컴포넌트를 import합니다.
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import queryString from "query-string";
import { checkoutProduct, sendMailCheckout } from "../services/API/checkoutApi";
import "../css/checkout.css";
import { createHistoryUser } from "../services/API/historyApi";
import io from "socket.io-client";
import { clearCart } from "../redux/cartSlice"; // clearCart 액션 가져오기
const socket = io("https://shop.c4ei.net");

export default function Checkout() {
  const { carts, cartTotalPrice } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.auth.login);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [load, setLoad] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: currentUser ? currentUser.fullname : "",
      email: currentUser ? currentUser.email : "",
      phone: currentUser ? currentUser.phone : "",
      address: currentUser ? `${currentUser.address1} ${currentUser.address2} ${currentUser.postcode}` : "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .matches(
          "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
            "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
            "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ가-힣0-9\\s]+$",
          "Fullname is invalid"
        )
        .min(2)
        .max(20),
      email: Yup.string()
        .required("Required")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email is invalid")
        .min(10),
      phone: Yup.string()
        .required("Required")
        .matches(/^[0-9]+$/, "Number phone is invalid")
        .min(10)
        .max(11),
        address: Yup.string()
        .required("Required")
        .matches(
          "^[/0-9a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
          "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
          "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ가-힣0-9\\s,()\\-]+$", // - 추가
          "Address is invalid"
        )
        .max(100),
      }),
    onSubmit: async (values) => {
      const paramsHistory = {
        idUser: currentUser.id,
        phone: values.phone,
        address: values.address,
        fullname: values.fullName,
        total: cartTotalPrice,
      };

      const detailsData = carts.map((item) => ({
        productId: item.product.id,
        purchasePrice: item.product.price,
        quantity: item.quantity,
      }));

      await createHistoryUser(dispatch, paramsHistory, detailsData);

      // send data to server
      socket.emit("send_order", currentUser.id);

      setLoad(true); // 로딩 상태를 설정합니다.
      await sendMailCheckout(dispatch, values, currentUser.token);
      setLoad(false); // 로딩 상태를 해제합니다.

      // 장바구니 비우기
      dispatch(clearCart());

      setLoad(!load);
      setTimeout(() => {
        setLoad(false);
        setSuccess(!success);
      }, 4000);
    },
  });

  return (
    <div>
      {load && (
        <div className="wrapper_loader">
          <div className="loader"></div>
        </div>
      )}
      <div className="container">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Checkout</h1>
              </div>
            </div>
          </div>
        </section>

        {!success && (
          <section className="py-5">
            <h2 className="h5 text-uppercase mb-4">Billing details</h2>
            <div className="row">
              <div className="col-lg-8">
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12 form-group m-0">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Fullname"
                      >
                        Full Name:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Enter Your Full Name Here!"
                        id="fullName"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                      />
                      <p className="text-2xs text-danger">
                        {formik.errors.fullName}
                      </p>
                    </div>
                    <div className="col-lg-12 form-group m-0">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Email"
                      >
                        Email:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Enter Your Email Here!"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                      <p className="text-2xs text-danger">
                        {formik.errors.email}
                      </p>
                    </div>
                    <div className="col-lg-12 form-group m-0">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Phone"
                      >
                        Phone Number:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Enter Your Phone Number Here!"
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                      />
                      <p className="text-2xs text-danger">
                        {formik.errors.phone}
                      </p>
                    </div>
                    <div className="col-lg-12 form-group m-0">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Address"
                      >
                        Address: <Link to="/manage" className="btn btn-secondary ml-3">주소 설정 하러 가기</Link> {" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Enter Your Address Here!"
                        id="address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                      />
                      <p className="text-2xs text-danger">
                        {formik.errors.address}
                      </p>
                    </div>
                    <div className="col-lg-12 form-group m-0">
                      <button
                        className="btn btn-dark"
                        style={{ color: "white" }}
                        type="submit"
                        disabled={formik.isSubmitting} // 버튼 비활성화 설정
                      >
                        Place order
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Your order</h5>
                    <ul className="list-unstyled mb-0">
                      {carts.map((item, index) => (
                        <div key={index}>
                          <li className="d-flex align-items-center justify-content-between">
                            <strong className="small font-weight-bold">
                              {item.product.good_name}
                            </strong>
                            <span className="text-muted small">
                              ₩{item.product.price} x {item.quantity}
                            </span>
                          </li>
                          <li className="border-bottom my-2"></li>
                        </div>
                      ))}
                      <li className="d-flex align-items-center justify-content-between">
                        <strong className="text-uppercase small font-weight-bold">
                          Total
                        </strong>
                        <span>₩{cartTotalPrice}</span>
                      </li>
                    </ul>
                    <h5 className="text-uppercase mb-4">입금하실 계좌정보 : 카카오뱅크 3333-27-5746222 예금주:씨포이아이(C4EI)</h5>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {success && (
          <section className="py-5">
            <div className="p-5">
              <h1>You Have Successfully Ordered!</h1>
              <p style={{ fontSize: "1.2rem" }}>Please Check Your Email.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
