import axios from "axios";
import {
  getHistoryFailed,
  getHistoryStart,
  getHistorySuccess,
  getListHistoryFailed,
  getListHistoryStart,
  getListHistorySucess,
} from "../../redux/historySlice";
import { DOMAIN } from "../../utils/settings/config";

export const createHistoryUser = async (dispatch, params) => {
  dispatch(getHistoryStart());
  try {
    await axios.post(`${DOMAIN}/api/v1/history`, params);
    dispatch(getHistorySuccess());
  } catch (err) {
    dispatch(getHistoryFailed(err));
  }
};

export const getListHistoryUser = async (dispatch, params = "") => {
  dispatch(getListHistoryStart());
  try {
    const response = await axios.get(`${DOMAIN}/api/v1/history/${params}`);
    dispatch(getListHistorySucess(response.data));
  } catch (err) {
    dispatch(getListHistoryFailed());
  }
};

export const updateHistory = async (dispatch, updatedHistory) => {
  try {
    // console.log("Sending PUT request to update history");
    // console.log("Updated history data:", updatedHistory);

    const response = await fetch(`${DOMAIN}/api/v1/history/${updatedHistory.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        delivery: updatedHistory.delivery,
        status: updatedHistory.status,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update history');
    }

    const data = await response.json();
    // console.log("Response from server:", data);

    // 선택적으로 상태 업데이트를 위한 Redux 액션을 디스패치합니다.
    // dispatch({ type: 'UPDATE_HISTORY', payload: data });

    // 히스토리 리스트를 다시 불러옵니다.
    getListHistoryUser(dispatch);
  } catch (error) {
    console.error('Error updating history:', error);
  }
};
