// /shop.c4ei.net/backend/middwares/auth/index.js
const { verifyToken } = require("../../services/auth");
const { getUserByEmail, getUserById } = require("../../services/users");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      const data = await verifyToken(accessToken);
      const user = await getUserById(data.id);

      if (!user) {
        return res.status(403).send("Token is not valid");
      }
      req.user = user;
      // req.user = {
      //   ...user.dataValues, // 기존 user 객체의 데이터를 모두 포함
      //   isAdmin: user.isAdmin === "1", // isAdmin 플래그 포함
      // };
      // console.log("/backend/middwares/auth/index.js : " + JSON.stringify(user));
      next();
    } else {
      return res.status(401).send("You're not authenticated");
    }
  } catch (err) {
    return res.status(401).send("You're not authenticated" + err);
  }
};

const verifyTokenandAdmin = (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  // console.log("verifyTokenandAdmin : id - " + id);
  if (user.id === id || user.admin) {
    next();
  } else {
    res.status(403).send("You're not allowed to delete others");
  }
};


module.exports = {
  authenticate,
  verifyTokenandAdmin
};
