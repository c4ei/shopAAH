// /shop.c4ei.net/frontend/src/services/API/goodsApi.js
import axios from "axios";

// 상품 목록을 페이징하여 가져오는 API 호출 함수
export const getListProductPanigation = async (query) => {
  try {
    const response = await axios.get(`/api/products${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};