// /shop.c4ei.net/frontend/src/components/DetailProduct.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { incrementItem } from "../redux/cartSlice";
import { createComment, getCommentProduct } from "../services/API/commentAPI";
import { getListProduct, getProductById } from "../services/API/productApi";
import DetailProduct1 from "./DetailProductParts/DetailProduct1";
import DetailProduct2 from "./DetailProductParts/DetailProduct2";
import DetailProduct3 from "./DetailProductParts/DetailProduct3";
import DetailProduct4 from "./DetailProductParts/DetailProduct4";
import queryString from "query-string";
// import moment from "moment";
import { toast } from "react-toastify";
import "./DetailProduct.css";

export default function DetailProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = useSelector((state) => state.product.productDetail?.product);
  const listProduct = useSelector((state) => state.product.products?.allProduct);
  const isFetching = useSelector((state) => state.product.products.isFetching);
  const error = useSelector((state) => state.product.products.error);

  const user = useSelector((state) => state.auth.login.currentUser);

  const listComment = useSelector((state) => {
    const comments = state.comment.loadComment.listComment;
    return comments.filter(comment => comment.idProduct === parseInt(id));
  });

  const [star, setStar] = useState(5);
  const [comment, setComment] = useState("");
  const [loadComment, setLoadComment] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      getProductById(dispatch, id);
    }
  }, [dispatch, id]);

  useEffect(() => {
    getListProduct(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const fetchComments = async () => {
      if (loadComment) {
        const params = { idProduct: id };
        const query = "?" + queryString.stringify(params);
        await getCommentProduct(dispatch, query);
        setLoadComment(false);
      }
    };
    fetchComments();
  }, [loadComment, dispatch, id]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading product details. Please try again later.</div>;
  }

  const limitedListProduct = Array.isArray(listProduct) ? listProduct.slice(0, 12) : [];

  const handleAddToCart = (product, quantity) => {
    dispatch(incrementItem({ product, quantity }));
    toast.success("장바구니에 물품이 담겼습니다.\n주문하러가기를 클릭 하시면 주문 가능 합니다.", {
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

  const handleComment = async () => {
    const data = { id, comment, star };
    await createComment(dispatch, data, user.token);
    setLoadComment(true);
    setComment("");
    setStar(5);
  };
  // DetailProduct1.js: 제품 이미지와 기본 정보.
  // DetailProduct2.js: 수량 선택 및 장바구니 추가.
  // DetailProduct3.js: 댓글 섹션.
  // DetailProduct4.js: 관련 제품.
  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-5">
          <DetailProduct1 product={product} />
        </div>
        <div className="row mb-5">
          <DetailProduct2 product={product} quantity={quantity} setQuantity={setQuantity} handleAddToCart={handleAddToCart} />
        </div>
        <DetailProduct3 comment={comment} setComment={setComment} star={star} setStar={setStar} handleComment={handleComment} listComment={listComment} />
        <DetailProduct4 limitedListProduct={limitedListProduct} />
      </div>
    </div>
  );
}
