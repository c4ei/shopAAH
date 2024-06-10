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

// ###################### subscribe ######################
const mysql = require('mysql2');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect(err => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
    return;
  }
  console.log('MySQL에 성공적으로 연결되었습니다.');
});

// 이메일 주소를 저장하는 라우트
app.post('/subscribe', (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send('이메일 주소를 입력해 주세요.');
  }

  const query = 'INSERT INTO subscribers (email) VALUES (?)';

  db.query(query, [email], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // 이미 존재하는 이메일의 경우
        return res.status(400).send('이미 가입된 이메일 주소입니다.');
      }
      console.error('데이터베이스 오류:', err);
      return res.status(500).send('서버 오류가 발생했습니다.');
    }
    res.status(200).send('구독해 주셔서 감사합니다!');
  });
});
// ###################### subscribe ######################

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
