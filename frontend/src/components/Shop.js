// /frontend/src/components/Shop.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Products from "./Products";
import Pagination from "@mui/material/Pagination";
import queryString from "query-string";
import { getListProductFilter, getListProductPanigation } from "../services/API/productApi";
import Search from "./Search";
import Sort from "./Sort";
import Category from "./Category";

export default function Shop() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 9,
    search: "",
    category: "68",
  });

  const dispatch = useDispatch();

  const productPanigation = useSelector((state) => state.product.products.allProduct.products || []);
  const isFetching = useSelector((state) => state.product.products.isFetching);
  const error = useSelector((state) => state.product.products.error);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        page: pagination.page,
        size: pagination.size,
        search: pagination.search,
        category: pagination.category,
        sort: sort,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;
      console.log("### API request params:", params);
      console.log("### API request query:", newQuery);
      try {
        const { products, totalProducts } = await getListProductPanigation(dispatch, newQuery) || {};
        console.log("### API response products:", products);
        console.log("### API response totalProducts:", totalProducts);
        setTotalPage(Math.ceil(totalProducts / pagination.size));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [pagination, sort, dispatch]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      const params = {
        page: "",
        size: "",
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);
      const newQuery = "?" + query;

      try {
        await getListProductFilter(dispatch, newQuery);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };

    fetchFilteredProducts();
  }, [pagination.category, dispatch]);

  useEffect(() => {
    setPage(1);
  }, [pagination.category]);

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

  const handleSort = (value) => {
    setSort(value);
  };

  useEffect(() => {
    console.log('Shop.js - productPanigation:', productPanigation);
    console.log('Shop.js - sort:', sort);
    console.log('Shop.js - isFetching:', isFetching);
    console.log('Shop.js - error:', error);
  }, [productPanigation, sort, isFetching, error]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products. Please try again later.</div>;
  }

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

      <section className="py-5">
        <div className="container p-0">
          <div className="row">
            <Category handleCategory={handleCategory} />
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
                  page={page}
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
