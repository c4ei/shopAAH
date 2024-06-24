import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const DetailProduct2 = ({ product, quantity, setQuantity, handleAddToCart }) => {
  const [cartAdded, setCartAdded] = useState(false);

  const decrementQuantity = () => {
    if (quantity <= 1) {
      toast.warn("At Least Must Be One Product", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      setQuantity((value) => value - 1);
      toast.success("Delete Product Success", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const incrementQuantity = () => {
    setQuantity((value) => value + 1);
    toast.success("Add Product Success", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const onChangeText = (value) => {
    setQuantity(value);
  };

  const handleAddToCartClick = (product, quantity) => {
    handleAddToCart(product, quantity);
    setCartAdded(true);
  };

  const getCategoryName = (category) => {
    switch (category) {
      case "68":
        return "건강";
      case "76":
        return "건강번들";
      case "69":
        return "가전";
      case "70":
        return "주방";
      case "71":
        return "생활";
      case "72":
        return "화장품";
      case "73":
        return "캐리어.잡화";
      case "74":
        return "캠핑";
      case "75":
        return "Watches & ACC";
      case "81":
        return "먹거리";
      case "80":
        return "전자담배";
      case "78":
        return "계절가전";
      default:
        return "Unknown category";
    }
  };

  return (
    <div>
      <div className="row align-items-stretch mb-4">
        <div className="col-sm-5 pr-sm-0">
          <div className="border d-flex align-items-center justify-content-between px-3 bg-white border-black">
            <span className="small text-uppercase text-gray mr-4 no-select" style={{width: "120px", }}>
              수량
            </span>
            <div className="quantity">
              <button className="dec-btn p-0" style={{ cursor: "pointer" }}>
                <i className="fas fa-caret-left" onClick={decrementQuantity}></i>
              </button>
              <input
                className="form-control border-0 shadow-0 p-0"
                type="text"
                onChange={(e) => onChangeText(e.target.value)}
                value={quantity}
              />
              <button className="inc-btn p-0" style={{ cursor: "pointer" }}>
                <i className="fas fa-caret-right" onClick={incrementQuantity}></i>
              </button>
            </div>
          </div>
        </div>
        <div className="col-sm-7 pl-sm-0 d-flex align-items-center"> {/* 여기서 열의 너비를 7로 설정 */}
          {product?.GDS_STOCK === 0 ? (
            <div className="btn btn-danger btn-md btn-block d-flex align-items-center justify-content-center px-0 text-white ml-2">
              재고 없음
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <button
                className="btn btn-dark btn-md d-flex align-items-center justify-content-center text-white ml-2"
                onClick={() => handleAddToCartClick(product, quantity)}
                style={{
                  fontSize: "1rem", // 글꼴 크기 증가
                  padding: "0.2rem 1rem", // 패딩 증가
                  height: "3rem", // 버튼 높이 증가
                  width: "200px", // 버튼 너비 증가
                }}
              >
                장바구니 담기
              </button>
              {cartAdded && (
                <Link
                  to="/cart"
                  className="btn btn-primary btn-md d-flex align-items-center justify-content-center text-white ml-2"
                  style={{
                    fontSize: "1rem", // 글꼴 크기 증가
                    padding: "0.2rem 1rem", // 패딩 증가
                    height: "3rem", // 버튼 높이 증가
                    width: "200px", // 버튼 너비 증가
                  }}
                >
                  주문하러가기
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      <br />
      <ul className="list-unstyled small d-inline-block">
        <li className="px-3 py-2 mb-1 bg-white text-muted">
          <strong className="text-uppercase text-dark">Category:</strong>
          <a className="reset-anchor ml-2">{getCategoryName(product?.category)}</a>
        </li>
        <li className="px-3 py-2 mb-1 bg-white text-muted">
          <strong className="text-uppercase text-dark">Tags:</strong>
          <a className="reset-anchor ml-2">Innovation</a>
        </li>
      </ul>
    </div>
  );
};

export default DetailProduct2;
