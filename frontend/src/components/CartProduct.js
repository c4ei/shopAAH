import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { getTotalPrice } from "../redux/cartSlice";
import CartEmpty from "./CartEmpty";
import CartFilter from "./CartFilter";

export default function CartProduct() {
  const dispatch = useDispatch();
  const { cartTotalPrice, cartToTalProduct, carts } = useSelector(
    (state) => state.cart
  );
  const user = useSelector((state) => state.auth.login.currentUser);

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getTotalPrice());
  }, [carts]);

  const handleProcess = () => {
    if (user !== null) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };
  return (
    <Fragment>
      {carts.length === 0 ? (
        <CartEmpty />
      ) : (
        <Fragment>
          <div className="container">
            <section className="py-5 bg-light">
              <div className="container">
                <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
                  <div className="col-lg-6">
                    <h1 className="h2 text-uppercase mb-0">Cart</h1>
                  </div>
                  <div className="col-lg-6 text-lg-right">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Cart
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </section>
            <section className="py-5">
              <h2 className="h5 text-uppercase mb-4">Shopping cart</h2>
              <div className="row">
                <div className="col-lg-8 mb-4 mb-lg-0">
                  <CartFilter />

                  <div className="bg-light px-4 py-3">
                    <div className="row align-items-center text-center">
                      <div className="col-md-6 mb-3 mb-md-0 text-md-left">
                        <NavLink
                          className="btn btn-link p-0 text-dark btn-sm"
                          to="/Goods"
                        >
                          <i className="fas fa-long-arrow-alt-left mr-2"> </i>
                          계속 쇼핑하기 {/* Continue shopping */}
                        </NavLink>
                      </div>
                      <div className="col-md-6 text-md-right">
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => handleProcess()}
                        >
                          주문 진행하기 {/* Procceed to checkout */}
                          <i className="fas fa-long-arrow-alt-right ml-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card border-0 rounded-0 p-lg-4 bg-light">
                    <div className="card-body">
                      <h5 className="text-uppercase mb-4">장바구니 합계</h5>
                      <ul className="list-unstyled mb-0">
                        <li className="d-flex align-items-center justify-content-between">
                          <strong className="text-uppercase small font-weight-bold">
                            제품 합계{/* Total Product */}
                          </strong>
                          <span className="text-muted small">
                            {cartToTalProduct}
                          </span>
                        </li>
                        <li className="d-flex align-items-center justify-content-between">
                          <strong className="text-uppercase small font-weight-bold">
                            {/* Subtotal */}
                            소계
                          </strong>
                          <span className="text-muted small">
                            ₩{cartTotalPrice}
                          </span>
                        </li>
                        <li className="border-bottom my-2"></li>
                        <li className="d-flex align-items-center justify-content-between mb-4">
                          <strong className="text-uppercase small font-weight-bold">
                            합계
                          </strong>
                          <span>
                            ₩{cartTotalPrice}
                            {cartTotalPrice !== 0 && ( // 분모가 0인 경우 에러 방지
                              <span>
                                {" ["}
                                {(cartTotalPrice/1500).toFixed(2)} AAH
                                {"]"}
                              </span>
                            )}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
