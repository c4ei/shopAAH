// /shop.c4ei.net/frontend/src/components/Goods.js
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import queryString from "query-string";
import { getListProductPanigation } from "../services/API/goodsApi";
import Search from "./Search";
import Category from "./Category";
import "./Goods.css"; // 커스텀 CSS 파일 임포트

export default function Goods() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 9,
    search: "",
    category: "68",
  });

  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    const initialCategory = queryParams.category || "68"; // 기본값을 68로 설정

    setPagination((prev) => ({
      ...prev,
      category: initialCategory,
    }));
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        page: pagination.page,
        size: pagination.size,
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;
    //   console.log("### API request params:", params);
    //   console.log("### API request query:", newQuery);
      try {
        const { products, totalProducts } = await getListProductPanigation(newQuery) || {};
        // console.log("### API response products:", products);
        // console.log("### API response totalProducts:", totalProducts);
        setProducts(products);
        setTotalPage(Math.ceil(totalProducts / pagination.size));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [pagination, dispatch]);

  const handleChangePage = (e, value) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setPage(value);
    setPagination((prev) => ({
      ...prev,
      page: value,
    }));
  };

  const handleCategory = (value) => {
    setPage(1);
    setPagination((prev) => ({
      ...prev,
      page: 1,
      category: value,
    }));
  };

  const handleSearch = (value) => {
    setPagination((prev) => ({
      ...prev,
      search: value,
      page: 1, // 검색 시 페이지를 1로 초기화
    }));
  };

  return (
    <div className="container">
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Goods</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Goods
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <section className="py-5">
        <div className="container p-0">
          <div className="row">
            <Category handleCategory={handleCategory} />
            <div className="col-lg-9 order-1 order-lg-2 mb-5 mb-lg-0">
              <div className="row mb-3 align-items-center">
                <Search handleSearch={handleSearch} />
              </div>
              <div className="row">
                {products.length > 0 ? (
                  products.map((item, index) => (
                    <div className="col-lg-4 col-sm-6 Section_Category mb-5" key={index}>
                      <div className="product text-center">
                        <div className="position-relative mb-3">
                          <NavLink className="d-block" to={`/detail/${item.id}`}>
                            <img className="img-fluid w-100" src={item.img1} alt="..." />
                          </NavLink>
                          <div className="product-overlay">
                            <ul className="mb-0 list-inline">
                              <li className="list-inline-item m-0 p-0">
                                <NavLink className="btn btn-sm btn-dark" to={`/detail/${item.id}`}>
                                  SHOW
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <h6>
                          <a className="reset-anchor">{item.good_name}</a>
                        </h6>
                        <p className="small text-muted">₩{item.price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No products available</div>
                )}
              </div>
              <div className="pagination-container d-flex justify-content-center mt-5">
                <Box sx={{ overflowX: 'auto', display: 'flex', justifyContent: 'center', padding: '0 10px', whiteSpace: 'nowrap' }}>
                  <Pagination
                    count={totalPage}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': { minWidth: '32px', margin: '0 2px', flexShrink: 0 },
                      '& .MuiPaginationItem-previousNext': { margin: '0 4px' },
                      '@media (max-width: 412px)': {
                        '& .MuiPaginationItem-root': { minWidth: '28px', margin: '0 1px' },
                        '& .MuiPaginationItem-previousNext': { margin: '0 2px' }
                      }
                    }}
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
