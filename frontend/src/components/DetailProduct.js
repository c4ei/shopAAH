// /shop.c4ei.net/frontend/src/components/DetailProduct.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { incrementItem } from "../redux/cartSlice";
import { createComment, getCommentProduct } from "../services/API/commentAPI";
import { getListProduct, getProductById } from "../services/API/productApi";
import ProductForYou from "./ProductForYou";
import queryString from "query-string";
import moment from "moment";
import { toast } from "react-toastify";
import "./DetailProduct.css"; // 커스텀 CSS 파일 임포트

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

  // 디버깅 로그
  // console.log('product:', product);
  // console.log('listProduct:', listProduct);
  // console.log('isFetching:', isFetching);
  // console.log('error:', error);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading product details. Please try again later.</div>;
  }

  const limitedListProduct = Array.isArray(listProduct) ? listProduct.slice(0, 12) : [];

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

  const handleAddToCart = (product, quantity) => {
    dispatch(incrementItem({ product, quantity }));
    toast.success("장바구니에 물품이 담겼습니다.\n우측 최상단의 cart를 클릭 하시면 주문 가능 합니다.", {
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
    setComment(""); // 댓글 입력 초기화
    setStar(5);    // 별점 초기화
  };

  const getCategoryName = (category) => {
    switch(category) {
      case "68": return "건강";
      case "76": return "건강번들";
      case "69": return "가전";
      case "70": return "주방";
      case "71": return "생활";
      case "72": return "화장품";
      case "73": return "캐리어.잡화";
      case "74": return "캠핑";
      case "75": return "Watches & ACC";
      case "81": return "먹거리";
      case "80": return "전자담배";
      case "78": return "계절가전";
      default: return "Unknown category";
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row mb-5">
          {/* <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0"> */}
          <div class="product-container">
            <div class="product-image">
              <img className="w-100" src={product?.img1} alt={product?.img1} style={{ width: '300px', height: '300px' }}  />
            </div>
            <div className="product-details">
              <h1 itemprop="name">{product?.good_name}</h1>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ul className="list-inline mb-2" style={{ marginRight: '10px' }}>
                  {/* Array.from({ length: 5 })는 5개의 빈 요소를 가진 배열을 생성합니다.
                  index < product?.rating 조건은 index가 product?.rating보다 작으면 채워진 별(text-warning), 
                  그렇지 않으면 비어있는 별(text-muted)을 표시합니다. */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <li className="list-inline-item m-0" key={index}>
                      <i className={`fas fa-star ${index < product?.rating ? 'text-warning' : 'text-muted'}`}></i>
                    </li>
                  ))}
                </ul>
                <p className="text-muted lead" style={{ margin: 0 }}>
                  <span itemprop="priceCurrency" content="KRW">₩</span>
                  <span itemprop="price">{product?.price?.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>
          {/* <div className="row m-sm-0">
            <div className="col-sm-2 p-sm-0 order-2 order-sm-1 mt-2 mt-sm-0">
              <div
                className="owl-thumbs d-flex flex-row flex-sm-column"
                data-slider-id="1"
              >
                {product?.img1 && (
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img className="w-100" src={product?.img1} alt={product?.img1} style={{ width: 'auto', height: '300px' }}  />
                  </div>
                )}
                {product?.img2 && (
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img className="w-100" src={product?.img2} alt={product?.img2} style={{ width: 'auto', height: '300px' }}  />
                  </div>
                )}
                {product?.img3 && (
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img className="w-100" src={product?.img3} alt={product?.img3} style={{ width: 'auto', height: '300px' }}  />
                  </div>
                )}
                {product?.img4 && (
                  <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
                    <img className="w-100" src={product?.img4} alt={product?.img4} style={{ width: 'auto', height: '300px' }}  />
                  </div>
                )}
              </div>
            </div>
            <div
              id="carouselExampleControls"
              className="carousel slide col-sm-10 order-1 order-sm-2"
              data-ride="carousel"
            >
              <div className="carousel-inner owl-carousel product-slider">
                {product?.img1 && (
                  <div className="carousel-item active">
                    <img className="d-block w-100" src={product?.img1} alt="First slide" style={{ width: 'auto', height: '300px' }}  />
                  </div>
                )}
                {product?.img2 && (
                  <div className="carousel-item">
                    <img className="d-block w-100" src={product?.img2} alt="Second slide" style={{ width: 'auto', height: '300px' }}  />
                  </div>
                )}
                {product?.img3 && (
                  <div className="carousel-item">
                    <img className="d-block w-100" src={product?.img3} alt="Third slide" style={{ width: 'auto', height: '300px' }}  />
                  </div>
                )}
                {product?.img4 && (
                  <div className="carousel-item">
                    <img className="d-block w-100" src={product?.img4} alt="Fourth slide" style={{ width: 'auto', height: '300px' }}  />
                  </div>
                )}
              </div>
              <a
                className="carousel-control-prev"
                href="#carouselExampleControls"
                role="button"
                data-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExampleControls"
                role="button"
                data-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div> */}
        </div>
        <div className="row mb-5">
          
          <p
            className="text-small mb-4 text-center text-sm-left product-description"
            dangerouslySetInnerHTML={{ __html: product?.description }}
          />

          <div className="row align-items-stretch mb-4">
            <div className="col-sm-5 pr-sm-0">
              <div className="border d-flex align-items-center justify-content-between px-3 bg-white border-black">
                <span className="small text-uppercase text-gray mr-4 no-select">
                  수량(Qty)
                </span>
                <div className="quantity">
                  <button
                    className="dec-btn p-0"
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      className="fas fa-caret-left"
                      onClick={() => decrementQuantity()}
                    ></i>
                  </button>
                  <input
                    className="form-control border-0 shadow-0 p-0"
                    type="text"
                    onChange={(e) => onChangeText(e.target.value)}
                    value={quantity}
                  />
                  <button
                    className="inc-btn p-0"
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      className="fas fa-caret-right"
                      onClick={() => incrementQuantity()}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-3 pl-sm-0">
              {product?.GDS_STOCK === 0 ? (
                <div className="btn btn-danger btn-md btn-block d-flex align-items-center justify-content-center px-0 text-white ml-2">
                  재고 없음
                </div>
              ) : (
                <button
                  className="btn btn-dark btn-md btn-block d-flex align-items-center justify-content-center px-0 text-white ml-2"
                  onClick={() => handleAddToCart(product, quantity)}
                >
                  장바구니에 담기(Add to cart)
                </button>
              )}
            </div>
            {/* <a className="btn btn-link text-dark p-1 mb-4" href="#">
              <i className="far fa-heart mr-2"></i>Add to wish list
            </a> */}
            <br></br>
            <ul className="list-unstyled small d-inline-block">
              <li className="px-3 py-2 mb-1 bg-white text-muted">
                <strong className="text-uppercase text-dark">
                  Category:
                </strong>
                <a className="reset-anchor ml-2">
                   { getCategoryName(product?.category) }
                  {/* {product?.category}s */}
                </a>
              </li>
              <li className="px-3 py-2 mb-1 bg-white text-muted">
                <strong className="text-uppercase text-dark">Tags:</strong>
                <a className="reset-anchor ml-2">Innovation</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1">Comment:</label>
          <textarea
            id="exampleFormControlTextarea1"
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex w-25">
            <span className="mt-2">Evaluate: </span>
            &nbsp; &nbsp;
            <input
              className="form-control w-25"
              type="number"
              min="1"
              max="5"
              value={star}
              onChange={(e) => setStar(e.target.value)}
              style={{
                fontSize: '14px',
                minWidth: '60px',
                padding: '2px 6px'
              }}
            />
            &nbsp; &nbsp;
            <span className="mt-2">Star</span>
          </div>
          <div>
            <button
              className="btn btn-dark btn-sm btn-block px-0 text-white"
              style={{ width: "12rem" }}
              onClick={() => handleComment()}
            >
              Send
            </button>
          </div>
        </div>
        <br />
        <ul className="nav nav-tabs border-0">
          <li className="nav-item">
            <a
              className="nav-link fix_comment"
              style={{ backgroundColor: "#383838", color: "#ffffff" }}
            >
              Reviews
            </a>
          </li>
        </ul>
        <div className="tab-content mb-5">
          <div className="tab-pane fade show active">
            <div className="p-4 p-lg-5 bg-white">
              <div className="col-lg-8">
                {listComment.map((value) => (
                  <div className="media mb-3" key={value.id}>
                    <img
                      className="rounded-circle"
                      src="https://img.icons8.com/color/36/000000/administrator-male.png"
                      alt=""
                      width="50"
                    />
                    <div className="media-body ml-3">
                      <h6 className="mb-0 text-uppercase">{value.fullname}</h6>
                      <p className="small text-muted mb-0 text-uppercase">
                        {moment(value.createdAt).format("DD-MM-YYYY hh:mm:ss")}
                      </p>
                      <ul className="list-inline mb-1 text-xs">
                        <li className="list-inline-item m-0">
                          <i className={value.star1}></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className={value.star2}></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className={value.star3}></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className={value.star4}></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className={value.star5}></i>
                        </li>
                      </ul>
                      <p className="text-small mb-0 text-muted">
                        {value.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <h2 className="h5 text-uppercase mb-4">Related products</h2>
        <div className="row d-block">
          {/* <ProductForYou listProduct={listProduct} /> */}
          <ProductForYou listProduct={limitedListProduct} />
        </div>
      </div>
    </div>
  );
}
