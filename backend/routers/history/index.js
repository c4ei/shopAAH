const express = require("express");
const {
  gethistory,
  createHistory,
  getListHistory,
  updateHistory,  // 추가
} = require("../../services/history");
const historyRouter = express.Router();

historyRouter.get("/", async (req, res) => {
  const { idUser } = req.query;

  if (idUser) {
    const user = await gethistory(idUser);
    if (!user) {
      return res.status(500).send("Can't get user history");
    }
    res.status(200).send(user);
  } else {
    const listHistory = await getListHistory();
    if (!listHistory) {
      return res.status(500).send("Can't get list history");
    }

    res.status(200).send(listHistory);
  }
});

historyRouter.post("/", async (req, res) => {
  const { idUser, phone, address, cart, fullname, total } = req.body;

  const history = await createHistory({
    idUser,
    phone,
    address,
    cart,
    fullname,
    total,
  });

  if (!history) {
    return res.status(500).send("Can't create history");
  }

  res.status(200).send(history);
});

// historyRouter.get("/", async (req, res) => {
//   const listHistory = await getListHistory();

//   if (!listHistory) {
//     return res.status(500).send("Can't get list history");
//   }

//   res.status(200).send(listHistory);
// });

historyRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { delivery, status } = req.body;

  // console.log("PUT request received");
  // console.log("id:", id);
  // console.log("delivery:", delivery);
  // console.log("status:", status);

  const updatedHistory = await updateHistory(id, { delivery, status });

  if (!updatedHistory) {
    console.log("Failed to update history");
    return res.status(500).send("Can't update history");
  }

  // console.log("History updated successfully", updatedHistory);
  res.status(200).send(updatedHistory);
});

module.exports = historyRouter;
