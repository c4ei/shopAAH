const { History, User } = require("../../models");

const gethistory = async (idUser) => {
  try {
    const historyUser = await History.findAll({
      where: {
        idUser,
      },
    });
    return historyUser;
  } catch (err) {
    console.log(err);
  }
};

const createHistory = async (data) => {
  try {
    const newHistory = await History.create(data);
    return newHistory;
  } catch (err) {
    console.log(err);
  }
};

const getListHistory = async () => {
  try {
    const listHistory = await History.findAll();
    return listHistory;
  } catch (err) {
    console.log(err);
  }
};

const updateHistory = async (id, data) => {
  try {
    // console.log("Updating history with id:", id);
    // console.log("Update data:", data);

    const updatedRowsCount = await History.update(data, {
      where: { id }
    });

    // console.log("Updated rows count:", updatedRowsCount);

    if (updatedRowsCount[0] === 0) {
      console.log("No history found to update");
      return null;
    }

    const updatedHistory = await History.findByPk(id); // 업데이트된 히스토리를 다시 가져옴
    // console.log("Updated history:", updatedHistory);
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
