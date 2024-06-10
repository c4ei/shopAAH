const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const rootRouter = require("./routers");
const cookieParser = require("cookie-parser");
const path = require("path");
const { createMess } = require("./services/messenger");
const app = express();
const httpServer = require("http").createServer(app);

dotenv.config();

app.use(
  cors({
    origin: "https://shop.c4ei.net",
    credentials: true,
  })
);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "https://shop.c4ei.net",
    credentials: true,
  },
});

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", rootRouter);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch((err) => {
    console.log("Unable to connect to the database", err);
  });

// (async () => {
//   await sequelize.sync();
// })();

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    const dataNew = {
      senderId: data.receiverId,
      receiverId: data.senderId,
      content: data.content,
      category: "receiver",
    };

    createMess(dataNew);
    socket.broadcast.emit("receive_message");
  });

  socket.on("send_order", (data) => {
    //Xử lý xong server gửi ngược lại client admin thông qua socket với key receive_order
    socket.broadcast.emit("receive_order", data);
  });
});

const publicPathDirectory = path.join(__dirname, "public");
app.use(express.static(publicPathDirectory));

app.get('/', function(req,resp){
  resp.sendFile( path.join(__dirname, 'public/index.html') )
})

const jwt = require("jsonwebtoken");
function isAdmin(req, res, next) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send("No refresh token found, please login.");
  }

  // Continue with your logic, e.g., verifying the token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).send("Token is not valid.");
    }

    // Set user information on req.user
    req.user = user;

    const userIsAdmin = req.user && req.user.admin=="1";
    if (userIsAdmin) {
      next(); // User is an admin, proceed to the next middleware/route handler
    } else {
      res.status(403).send('Access denied. Only administrators can access this resource.');
    }
  });
}

// Restricted routes
const adminRoutes = [
  '/admin',
  '/users',
  '/products',
  '/history',
  '/chat'
];

adminRoutes.forEach(route => {
  app.get(route, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
});

//이 코드는 항상 가장 하단에 놓아야 잘됩니다. 
app.get('*', function (req, resp) {
  resp.sendFile(path.join(__dirname, 'public/index.html'));
});


const PORT = process.env.PORT || 3021;

httpServer.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
