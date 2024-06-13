// /shop.c4ei.net/frontend/src/redux/historySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  historyUser: {
    isFetching: false,
    isSuccess: false,
    isError: false,
  },
  listHistory: {
    histories: [],
    isFetching: false,
    isError: false,
  },
  historyDetail: {
    detail: null,
    isFetching: false,
    isError: false,
  },
};

const historySlice = createSlice({
  name: "history",
  initialState: initialState, // 초기 상태 확인
  reducers: {
    getHistoryStart: (state) => {
      state.historyUser.isFetching = true;
    },
    getHistorySuccess: (state) => {
      state.historyUser.isFetching = false;
      state.historyUser.isSuccess = true;
    },
    getHistoryFailed: (state) => {
      state.historyUser.isFetching = false;
      state.historyUser.isError = true;
    },
    getListHistoryStart: (state) => {
      state.listHistory.isFetching = true;
    },
    getListHistorySucess: (state, action) => {
      state.listHistory.isFetching = false;
      state.listHistory.histories = action.payload;
    },
    getListHistoryFailed: (state) => {
      state.listHistory.isFetching = false;
      state.listHistory.isError = true;
    },
    getHistoryDetailStart: (state) => {
      if (!state.historyDetail) { // 상태 객체가 정의되지 않았을 경우 초기화
        state.historyDetail = {
          detail: null,
          isFetching: false,
          isError: false,
        };
      }
      state.historyDetail.isFetching = true;
    },
    getHistoryDetailSuccess: (state, action) => {
      state.historyDetail.isFetching = false;
      state.historyDetail.detail = action.payload;
      console.log('Redux state updated:', action.payload); // 디버깅 로그 추가
    },
    getHistoryDetailFailed: (state) => {
      state.historyDetail.isFetching = false;
      state.historyDetail.isError = true;
    },
  },
});

export const {
  getHistoryStart,
  getHistorySuccess,
  getHistoryFailed,
  getListHistoryStart,
  getListHistorySucess,
  getListHistoryFailed,
  getHistoryDetailStart,
  getHistoryDetailSuccess,
  getHistoryDetailFailed,
} = historySlice.actions;

export default historySlice.reducer;