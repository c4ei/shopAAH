import axios from "axios";
import {
  createProductFailed,
  createProductStart,
  createProductSucess,
  deleteProductFailed,
  deleteProductStart,
  deleteProductSuccess,
  getProductDetailFailed,
  getProductDetailStart,
  getProductDetailSuccess,
  getProductFilterFailed,
  getProductFilterStart,
  getProductFilterSuccess,
  getProductPanigationFailed,
  getProductPanigationStart,
  getProductPanigationSuccess,
  getProductStart,
  getProductSuccess,
  getProductFailed,
} from "../../redux/productSlice";
import { DOMAIN } from "../../utils/settings/config";

export const getListProduct = async (dispatch, params) => {
  dispatch(getProductStart());
  try {
    const response = await axios.get(`${DOMAIN}/api/v1/products/`, { params });
    dispatch(getProductSuccess(response.data));
  } catch (err) {
    dispatch(getProductFailed(err));
  }
};

export const getListProduct10 = async (dispatch, params) => {
  dispatch(getProductStart());
  try {
    const response = await axios.get(`${DOMAIN}/api/v1/products/main`, { params });
    console.log('API response:', response.data); // 디버깅 로그
    dispatch(getProductSuccess(response.data));
  } catch (err) {
    console.error('API call failed:', err); // 디버깅 로그
    dispatch(getProductFailed(err));
  }
};

// /frontend/src/services/API/productApi.js
export const getListProductPanigation = async (dispatch, params) => {
  dispatch(getProductPanigationStart());
  try {
    const response = await axios.get(`${DOMAIN}/api/v1/products${params}`);
    const { products, totalProducts } = response.data; // axios는 자동으로 JSON 응답을 파싱합니다.
    dispatch({ type: 'SET_PRODUCT_PANIGATION', payload: products });
    return { products, totalProducts };
  } catch (err) {
    dispatch(getProductPanigationFailed(err));
    return { products: [], totalProducts: 0 }; // 에러 발생 시 기본 값 반환
  }
};

export const getListProductFilter = async (dispatch, params) => {
  dispatch(getProductFilterStart());
  try {
    const response = await axios.get(`${DOMAIN}/api/v1/products/${params}`);
    dispatch(getProductFilterSuccess(response.data));
  } catch (err) {
    dispatch(getProductFilterFailed(err));
  }
};

export const getProductById = async (dispatch, id) => {
  dispatch(getProductDetailStart());
  try {
    const response = await axios.get(`${DOMAIN}/api/v1/products/${id}`);
    dispatch(getProductDetailSuccess(response.data));
  } catch (err) {
    dispatch(getProductDetailFailed(err.response.data));
  }
};

export const createProduct = async (dispatch, params) => {
  dispatch(createProductStart());
  try {
    await axios.post(`${DOMAIN}/api/v1/products`, params);
    dispatch(createProductSucess());
  } catch (err) {
    dispatch(createProductFailed(err));
  }
};

export const deleteProduct = async (dispatch, id) => {
  dispatch(deleteProductStart());
  try {
    await axios.delete(`${DOMAIN}/api/v1/products/${id}`);
    dispatch(deleteProductSuccess());
  } catch (err) {
    dispatch(deleteProductFailed(err));
  }
};
