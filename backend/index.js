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
    socket.broadcast.emit("receive_order", data);
  });
});

// ###################### subscribe ######################
const mysql = require('mysql2');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL 데이터베이스 연결 풀 설정
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
    return;
  }
  console.log('MySQL에 성공적으로 연결되었습니다.');
  connection.release();
});

// 이메일 주소를 저장하는 라우트
app.post('/subscribe', (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send('이메일 주소를 입력해 주세요.');
  }

  const query = 'INSERT INTO subscribers (email) VALUES (?)';

  pool.query(query, [email], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('이미 가입된 이메일 주소입니다.');
      }
      console.error('데이터베이스 오류:', err);
      return res.status(500).send('서버 오류가 발생했습니다.');
    }
    res.status(200).send('구독해 주셔서 감사합니다!');
  });
});
// ###################### subscribe ######################

// ###################### address ######################
app.post('/saveUserInfo', (req, res) => {
  const { id, email, phone, address1, address2, postcode } = req.body;
  
  const query = `UPDATE Users SET email = ?, phone = ?, address1 = ?, address2 = ?, postcode = ? WHERE id = ?`;

  pool.query(query, [email, phone, address1, address2, postcode, id], (err, result) => {
    if (err) {
      return res.status(500).send("정보를 저장하는 동안 오류가 발생했습니다.");
    }
    res.send("정보가 성공적으로 저장되었습니다.");
  });
});
// ###################### address ######################

// ###################### Product ######################
app.post('/saveProduct', (req, res) => {
  const {
    id, good_name, description, price, img1, img2, img3, img4, category, 
    originalPrice, promotionPercent, ORG_ITEM, GDS_PRICE_ORG, 
    GDS_AAH_PRICE, GDS_STOCK
  } = req.body;

  const query = `UPDATE Products SET 
    good_name = ?, description = ?, price = ?, img1 = ?, img2 = ?, 
    img3 = ?, img4 = ?, category = ?, originalPrice = ?, 
    promotionPercent = ?, ORG_ITEM = ?, GDS_PRICE_ORG = ?, 
    GDS_AAH_PRICE = ?, GDS_STOCK = ? 
    WHERE id = ?`;

  pool.query(query, [
    good_name, description, price, img1, img2, img3, img4, category, 
    originalPrice, promotionPercent, ORG_ITEM, GDS_PRICE_ORG, 
    GDS_AAH_PRICE, GDS_STOCK, id
  ], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send('제품 정보를 저장하는 동안 오류가 발생했습니다.');
    }
    res.send('제품 정보가 DB에 성공적으로 저장되었습니다.\n페이지를 새로 고침 하셔야 반영확인 됩니다.');
  });
});
// ###################### Product ######################

// ###################### Goods ######################
app.get('/api/products', (req, res) => {
  const { page = 1, size = 9, search = '', category = '' } = req.query;
  const offset = (page - 1) * size;

  console.log('### API request received with params:', { page, size, search, category });

  let query = 'SELECT * FROM Products WHERE 1=1';
  let countQuery = 'SELECT COUNT(*) AS total FROM Products WHERE 1=1';
  const queryParams = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    countQuery += ' AND category = ?';
    queryParams.push(category);
  }

  if (search) {
    query += ' AND good_name LIKE ?';
    countQuery += ' AND good_name LIKE ?';
    queryParams.push(`%${search}%`);
  }

  query += ' LIMIT ? OFFSET ?';
  queryParams.push(parseInt(size), offset);

  pool.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('상품 조회 오류:', err);
      return res.status(500).send('서버 오류가 발생했습니다.');
    }

    pool.query(countQuery, queryParams.slice(0, queryParams.length - 2), (err, countResults) => {
      if (err) {
        console.error('상품 수 조회 오류:', err);
        return res.status(500).send('서버 오류가 발생했습니다.');
      }

      const totalProducts = countResults[0].total;
      res.status(200).json({ products: results, totalProducts });
    });
  });
});
// ###################### Goods ######################

// ###################### 친구, 포인트 ######################
// 친구 목록 가져오기
app.get('/api/friends/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT id, email 
    FROM Users 
    WHERE referrer_id = ?
  `;
  pool.query(query, [userId], (error, results) => {
    if (error) {
      console.error("친구 목록을 가져오는 동안 오류가 발생했습니다:", error);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    res.json(results);
  });
});

// 포인트 및 적립금액 가져오기
app.get('/api/rewards/:userId', (req, res) => {
  const { userId } = req.params;
  const userQuery = `
    SELECT reward_points 
    FROM Users 
    WHERE id = ?
  `;
  const rewardsQuery = `
    SELECT 
      SUM(CAST(H.total AS DECIMAL(10,2))) AS total_purchase,
      SUM(CAST(H.total AS DECIMAL(10,2))) * 0.01 AS total_rewards
    FROM Histories H
    JOIN Users U ON U.id = H.idUser
    WHERE U.referrer_id = ?
  `;
  
  pool.query(userQuery, [userId], (error, userResults) => {
    if (error) {
      console.error("포인트를 가져오는 동안 오류가 발생했습니다:", error);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    
    pool.query(rewardsQuery, [userId], (error, rewardsResults) => {
      if (error) {
        console.error("적립금액을 가져오는 동안 오류가 발생했습니다:", error);
        res.status(500).send("서버 오류가 발생했습니다.");
        return;
      }
      
      const reward_points = userResults[0]?.reward_points || 0;
      const total_rewards = rewardsResults[0]?.total_rewards || 0;
      
      res.json({
        reward_points,
        total_rewards
      });
    });
  });
});
// ###################### 친구, 포인트 ######################

const publicPathDirectory = path.join(__dirname, "public");
app.use(express.static(publicPathDirectory));

app.get('/', function(req,resp){
  resp.sendFile(path.join(__dirname, 'public/index.html'))
})

const jwt = require("jsonwebtoken");
function isAdmin(req, res, next) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send("No refresh token found, please login.");
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).send("Token is not valid.");
    }

    req.user = user;

    const userIsAdmin = req.user && req.user.admin == "1";
    if (userIsAdmin) {
      next();
    } else {
      res.status(403).send('Access denied. Only administrators can access this resource.');
    }
  });
}

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

app.get('*', function (req, resp) {
  resp.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3021;

httpServer.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
