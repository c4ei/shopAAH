// /shop.c4ei.net/backend/routers/history/index.js
const express = require("express");
const {
  gethistory,
  createHistory,
  getListHistory,
  updateHistory,
  getHistoryDetail, // 새로운 함수 임포트
} = require("../../services/history");
const historyRouter = express.Router();

// 특정 사용자의 히스토리 가져오기
historyRouter.get("/", async (req, res) => {
  const { idUser } = req.query;

  if (idUser) {
    const userHistory = await gethistory(idUser);
    if (!userHistory) {
      return res.status(500).send("Can't get user history");
    }
    res.status(200).send(userHistory);
  } else {
    const listHistory = await getListHistory();
    if (!listHistory) {
      return res.status(500).send("Can't get list history");
    }
    res.status(200).send(listHistory);
  }
});

// 히스토리 상세 정보 가져오기
historyRouter.get("/detail/:id", async (req, res) => {
  const { id } = req.params;

  const historyDetail = await getHistoryDetail(id);
  if (!historyDetail) {
    return res.status(500).send("Can't get history detail");
  }

  res.status(200).send(historyDetail);
});

// 히스토리 생성
historyRouter.post("/", async (req, res) => {
  const { historyData, detailsData } = req.body; // historyData와 detailsData로 분리

  const history = await createHistory({
    historyData,
    detailsData,
  });

  if (!history) {
    return res.status(500).send("Can't create history");
  }

  res.status(200).send(history);
});

// 히스토리 업데이트
historyRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { historyData, detailsData } = req.body; // historyData와 detailsData로 분리

  const updatedHistory = await updateHistory(id, {
    historyData,
    detailsData,
  });

  if (!updatedHistory) {
    return res.status(500).send("Can't update history");
  }

  res.status(200).send(updatedHistory);
});

module.exports = historyRouter;
