// /shop.c4ei.net/backend/services/history/index.js
const { History, User, HistoryDetail } = require("../../models");

const gethistory = async (idUser) => {
  try {
    const historyUser = await History.findAll({
      where: {
        idUser,
      },
      include: [HistoryDetail], // HistoryDetail을 포함하여 조회
    });
    return historyUser;
  } catch (err) {
    console.log(err);
  }
};

const createHistory = async (data) => {
  const { historyData, detailsData } = data; // historyData와 detailsData로 데이터 분리

  try {
    const newHistory = await History.create(historyData);

    // HistoryDetail 항목들을 생성합니다.
    if (detailsData && detailsData.length > 0) {
      const historyDetails = detailsData.map(detail => ({
        ...detail,
        historyId: newHistory.id
      }));
      await HistoryDetail.bulkCreate(historyDetails);
    }

    return newHistory;
  } catch (err) {
    console.log(err);
  }
};

const getListHistory = async () => {
  try {
    const listHistory = await History.findAll({
      include: [HistoryDetail], // HistoryDetail을 포함하여 조회
    });
    return listHistory;
  } catch (err) {
    console.log(err);
  }
};

const updateHistory = async (id, data) => {
  const { historyData, detailsData } = data; // historyData와 detailsData로 데이터 분리

  try {
    const updatedRowsCount = await History.update(historyData, {
      where: { id }
    });

    if (updatedRowsCount[0] === 0) {
      console.log("No history found to update");
      return null;
    }

    // HistoryDetail 항목들을 업데이트하거나 생성합니다.
    if (detailsData && detailsData.length > 0) {
      // 기존의 HistoryDetail 항목들을 삭제하고 다시 생성합니다.
      await HistoryDetail.destroy({ where: { historyId: id } });
      const historyDetails = detailsData.map(detail => ({
        ...detail,
        historyId: id
      }));
      await HistoryDetail.bulkCreate(historyDetails);
    }

    const updatedHistory = await History.findByPk(id, {
      include: [HistoryDetail], // HistoryDetail을 포함하여 조회
    });
    return updatedHistory;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  gethistory,
  createHistory,
  getListHistory,
  updateHistory,
};
