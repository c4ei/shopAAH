// /shop.c4ei.net/frontend/src/components/Shop.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Products from "./Products";
import Pagination from "@mui/material/Pagination";
import queryString from "query-string";
import { getListProductFilter, getListProductPanigation } from "../services/API/productApi";
import Search from "./Search";
import Sort from "./Sort";

export default function Shop() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: "1",
    size: "9",
    search: "",
    category: "76", // 예시로 카테고리 초기값 설정
  });

  const dispatch = useDispatch();
  const productPanigation = useSelector((state) => state.product.productPanigation?.allProductPanigation || []);

  useEffect(() => {
    const params = queryString.parse(window.location.search);
    if (params.category) {
      setPagination((prev) => ({
        ...prev,
        category: params.category,
      }));
    }
  }, []);

  useEffect(() => {
    (async () => {
      const params = {
        page: pagination.page,
        size: pagination.size,
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;
      const { products, totalProducts } = await getListProductPanigation(dispatch, newQuery) || {};

      console.log("/frontend/src/components/Shop.js --59 -- products: ", products);
      console.log("/frontend/src/components/Shop.js --59 -- totalProducts: ", totalProducts);

      // 상품 목록을 가져왔을 때 totalProducts로 totalPage 설정
      setTotalPage(Math.ceil(totalProducts / pagination.size));
    })();
  }, [pagination, page, sort]); // pagination, page, sort 변경 시에만 호출

  useEffect(() => {
    (async () => {
      const params = {
        page: "",
        size: "",
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;
      await getListProductFilter(dispatch, newQuery);
    })();
  }, [pagination, sort]); // pagination, sort 변경 시에만 호출

  useEffect(() => {
    setPage(1); // 카테고리 변경 시 페이지를 1로 설정
  }, [pagination.category]); // pagination.category 변경 시에만 호출

  const handleChangePage = (e, value) => {
    e.preventDefault();
    window.scrollTo(0, 0);

    setPage(value);

    setPagination((prev) => ({
      ...prev,
      page: value.toString(), // 페이지 번호는 문자열로 변환
    }));
  };

  const handleCategory = (value) => {
    setPage(1); // 카테고리 변경 시 페이지를 1로 설정
    setPagination((prev) => ({
      ...prev,
      page: "1",
      category: value,
    }));
  };

  const handleSearch = (value) => {
    setPagination((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleSort = (value) => {
    setSort(value); // 정렬 변경 시 sort 상태 업데이트
  };

  return (
    <div className="container">
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Shop</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Shop
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {productPanigation.map((item, index) => (
        <div className="modal fade show" id={`product_${item.id}`} key={index}>
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-body p-0">
                <div className="row align-items-stretch">
                  <div className="col-lg-6 p-lg-0">
                    <img
                      style={{ width: "100%" }}
                      className="product-view d-block h-100 bg-cover bg-center"
                      src={item.img1}
                      data-lightbox={`product_${item.id}`}
                    />
                    <img className="d-none" href={item.img2} />
                    <img className="d-none" href={item.img3} />
                  </div>
                  <div className="col-lg-6">
                    <a
                      className="close p-4"
                      type="button"
                      href="#section_product"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      ×
                    </a>
                    <div className="p-5 my-md-4">
                      <ul className="list-inline mb-2">
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                        <li className="list-inline-item m-0">
                          <i className="fas fa-star small text-warning"></i>
                        </li>
                      </ul>
                      <h2 className="h4">{item.good_name}</h2>
                      <p className="text-muted font-weight-bold">
                        ₩{item.price}
                      </p>
                      <div className="row align-items-stretch mb-4">
                        <div className="col-sm-5 pl-sm-0 fix_addwish">
                          <a className="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0">
                            <i className="far fa-heart mr-2"></i>Add To Wish
                            List
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <section className="py-5">
        <div className="container p-0">
          <div className="row">
            <div className="col-lg-3 order-2 order-lg-1">
              <h5 className="text-uppercase mb-4">Categories</h5>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("all")}
                  >
                    All
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("68")}
                  >
                    건강
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("72")}
                  >
                    화장품
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("75")}
                  >
                    Watches & ACC
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("69")}
                  >
                    가전
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("71")}
                  >
                    생활
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("70")}
                  >
                    주방
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("73")}
                  >
                    캐리어.잡화
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("74")}
                  >
                    캠핑
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("76")}
                  >
                    건강번들
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("81")}
                  >
                    먹거리
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("80")}
                  >
                    전자담배
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handleCategory("78")}
                  >
                    계절가전
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-9 order-1 order-lg-2 mb-5 mb-lg-0">
              <div className="row mb-3 align-items-center">
                <Search handleSearch={handleSearch} />
                <div className="col-lg-8">
                  <ul className="list-inline d-flex align-items-center justify-content-lg-end mb-0">
                    <li className="list-inline-item">
                      <Sort handleSort={handleSort} />
                    </li>
                  </ul>
                </div>
              </div>
              <Products productPanigation={productPanigation} sort={sort} />
              <div className="d-flex justify-content-center mt-5">
                <Pagination
                  count={totalPage}
                  page={parseInt(page)}
                  onChange={handleChangePage}
                  color="primary"
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
