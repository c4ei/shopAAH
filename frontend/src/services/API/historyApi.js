// /shop.c4ei.net/frontend/src/services/API/historyApi.js
import axios from "axios";
import {
  getHistoryFailed,
  getHistoryStart,
  getHistorySuccess,
  getListHistoryFailed,
  getListHistoryStart,
  getListHistorySucess,
  getHistoryDetailStart,
  getHistoryDetailSuccess,
  getHistoryDetailFailed,
} from "../../redux/historySlice";
import { DOMAIN } from "../../utils/settings/config";

// 히스토리 생성
export const createHistoryUser = async (dispatch, historyData, detailsData) => {
  dispatch(getHistoryStart());
  try {
    await axios.post(`${DOMAIN}/api/v1/history`, { historyData, detailsData });
    dispatch(getHistorySuccess());
  } catch (err) {
    dispatch(getHistoryFailed(err));
  }
};

// 히스토리 리스트 가져오기
export const getListHistoryUser = async (dispatch, params = "") => {
  dispatch(getListHistoryStart());
  try {
    const response = await axios.get(`${DOMAIN}/api/v1/history/${params}`);
    dispatch(getListHistorySucess(response.data));
  } catch (err) {
    dispatch(getListHistoryFailed());
  }
};

// 히스토리 상세 정보 가져오기
export const getHistoryDetail = async (dispatch, historyId) => {
  dispatch(getHistoryDetailStart());
  try {
    const response = await axios.get(`${DOMAIN}/api/v1/history/detail/${historyId}`);
    console.log("API response:", response.data); // 디버깅 로그 추가
    dispatch(getHistoryDetailSuccess(response.data));
  } catch (err) {
    dispatch(getHistoryDetailFailed(err));
  }
};

// 히스토리 업데이트
export const updateHistory = async (dispatch, updatedHistory, detailsData) => {
  try {
    const response = await axios.put(`${DOMAIN}/api/v1/history/${updatedHistory.id}`, {
      historyData: {
        delivery: updatedHistory.delivery,
        status: updatedHistory.status,
      },
      detailsData,
    });

    if (!response.ok) {
      throw new Error('Failed to update history');
    }

    const data = await response.data;

    // 선택적으로 상태 업데이트를 위한 Redux 액션을 디스패치합니다.
    // dispatch({ type: 'UPDATE_HISTORY', payload: data });

    // 히스토리 리스트를 다시 불러옵니다.
    getListHistoryUser(dispatch);
  } catch (error) {
    console.error('Error updating history:', error);
  }
};