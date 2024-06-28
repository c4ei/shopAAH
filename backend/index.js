// /shop.c4ei.net/backend/index.js
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
const axios = require('axios');

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

// ###################### mysql ######################
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL 데이터베이스 연결 풀 설정
const pool = mysql.createPool({
  connectionLimit: 50,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL에 성공적으로 연결되었습니다.');
    connection.release();
  } catch (err) {
    console.error('MySQL 연결 오류:', err);
  }
})();
// ###################### mysql ######################

// ###################### subscribe ######################
app.post('/api/subscribe', async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send('이메일 주소를 입력해 주세요.');
  }

  const query = 'INSERT INTO subscribers (email) VALUES (?)';

  try {
    await pool.query(query, [email]);
    res.status(200).send('구독해 주셔서 감사합니다!');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).send('이미 가입된 이메일 주소입니다.');
    }
    console.error('데이터베이스 오류:', err);
    res.status(500).send('서버 오류가 발생했습니다.');
  }
});
// ###################### subscribe ######################

// ###################### address ######################
app.post('/api/saveUserInfo', async (req, res) => {
  const { id, email, phone, address1, address2, postcode } = req.body;

  const query = `UPDATE Users SET email = ?, phone = ?, address1 = ?, address2 = ?, postcode = ? WHERE id = ?`;

  try {
    await pool.query(query, [email, phone, address1, address2, postcode, id]);
    res.send("정보가 성공적으로 저장되었습니다.");
  } catch (err) {
    console.error("정보를 저장하는 동안 오류가 발생했습니다.", err);
    res.status(500).send("정보를 저장하는 동안 오류가 발생했습니다.");
  }
});

app.get('/api/userInfo/:userId', async (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT address1, address2, postcode 
    FROM Users 
    WHERE id = ?
  `;
  try {
    const [results] = await pool.query(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error("친구 주소를 가져오는 동안 오류가 발생했습니다:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

// ###################### address ######################

// ###################### Product ######################
app.post('/api/saveProduct', async (req, res) => {
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

  try {
    await pool.query(query, [
      good_name, description, price, img1, img2, img3, img4, category, 
      originalPrice, promotionPercent, ORG_ITEM, GDS_PRICE_ORG, 
      GDS_AAH_PRICE, GDS_STOCK, id
    ]);
    res.send('제품 정보가 DB에 성공적으로 저장되었습니다.\n페이지를 새로 고침 하셔야 반영확인 됩니다.');
  } catch (err) {
    console.error('제품 정보를 저장하는 동안 오류가 발생했습니다.', err);
    res.status(500).send('제품 정보를 저장하는 동안 오류가 발생했습니다.');
  }
});
// ###################### Product ######################

// ###################### Goods ######################
app.get('/api/products', async (req, res) => {
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

  try {
    const [results] = await pool.query(query, queryParams);
    const [countResults] = await pool.query(countQuery, queryParams.slice(0, queryParams.length - 2));
    const totalProducts = countResults[0].total;
    res.status(200).json({ products: results, totalProducts });
  } catch (err) {
    console.error('상품 조회 오류:', err);
    res.status(500).send('서버 오류가 발생했습니다.');
  }
});

app.get('/api/bigsaleprod', async (req, res) => {
  let query = 'SELECT * FROM Products WHERE promotionPercent >= 5 LIMIT 10';
  const queryParams = [];

  try {
    const [results] = await pool.query(query, queryParams);
    res.status(200).json({ products: results });
  } catch (err) {
    console.error('BIGSALE 상품 조회 오류:', err);
    res.status(500).send('서버 오류가 발생했습니다.');
  }
});
// ###################### Goods ######################

// ###################### 친구, 포인트 ######################
// 친구 목록 가져오기
app.get('/api/friends/:userId', async (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT id, email 
    FROM Users 
    WHERE referrer_id = ?
  `;
  try {
    const [results] = await pool.query(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error("친구 목록을 가져오는 동안 오류가 발생했습니다:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

// 포인트 및 적립금액 가져오기
app.get('/api/rewards/:userId', async (req, res) => {
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
  
  try {
    const [userResults] = await pool.query(userQuery, [userId]);
    const [rewardsResults] = await pool.query(rewardsQuery, [userId]);
    
    const reward_points = userResults[0]?.reward_points || 0;
    const total_rewards = rewardsResults[0]?.total_rewards || 0;
    
    res.json({
      reward_points,
      total_rewards
    });
  } catch (error) {
    console.error("포인트 및 적립금액을 가져오는 동안 오류가 발생했습니다:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});
// ###################### 친구, 포인트 ######################

// ###################### cart, history, 이메일 ######################

app.post("/api/cart", loginchk, async (req, res) => {
  const { idProduct, productCount } = req.query;
  const user = req.user;

  try {
    const productQuery = "SELECT * FROM Products WHERE id = ?";
    const [productResult] = await pool.query(productQuery, [idProduct]);
    const product = productResult[0];

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const cartQuery = `INSERT INTO Cart (idUser, idProduct, nameProduct, priceProduct, count, img)
                       VALUES (?, ?, ?, ?, ?, ?)`;
    await pool.query(cartQuery, [
      user.id,
      idProduct,
      product.good_name,
      product.price,
      productCount,
      product.img1,
    ]);

    res.status(200).send("Cart item added successfully");
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).send("Error adding to cart");
  }
});

const getCartByUser = async (idUser) => {
  try {
    const cartQuery = "SELECT * FROM Cart WHERE idUser = ?";
    const [cartResult] = await pool.query(cartQuery, [idUser]);
    return cartResult;
  } catch (err) {
    console.error("Error fetching cart:", err);
    throw err;
  }
};

const addToCart = async (product) => {
  try {
    const cartQuery = `INSERT INTO Cart (idUser, idProduct, nameProduct, priceProduct, count, img)
                       VALUES (?, ?, ?, ?, ?, ?)`;
    await pool.query(cartQuery, [
      product.idUser,
      product.idProduct,
      product.nameProduct,
      product.priceProduct,
      product.count,
      product.img,
    ]);
    return true;
  } catch (err) {
    console.error("Error adding to cart:", err);
    throw err;
  }
};

// 주문 생성 엔드포인트 추가
app.post("/api/history", loginchk, async (req, res) => {
  const { paramsHistory, detailsData } = req.body;
  const user = req.user;

  const historyData = {
    idUser: user.id,
    phone: paramsHistory.phone,
    address: paramsHistory.address,
    fullname: paramsHistory.fullname,
    total: paramsHistory.total,
    status: paramsHistory.status || 0, // 기본값 0
    delivery: paramsHistory.delivery || 0, // 기본값 0
    createdAt: new Date(),
    updatedAt: new Date(),
    memo: paramsHistory.memo
  };

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const historyQuery = `
      INSERT INTO Histories (idUser, phone, address, fullname, total, status, delivery, createdAt, updatedAt, memo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const historyParams = [
      historyData.idUser, historyData.phone, historyData.address, historyData.fullname, 
      historyData.total, historyData.status, historyData.delivery, historyData.createdAt, 
      historyData.updatedAt, historyData.memo
    ];
    const [historyResult] = await connection.query(historyQuery, historyParams);
    const historyId = historyResult.insertId;

    const detailQuery = `
      INSERT INTO HistoryDetails (historyId, productId, purchasePrice, quantity, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const detail of detailsData) {
      const detailParams = [
        historyId, detail.productId, detail.purchasePrice, detail.quantity, new Date(), new Date()
      ];
      await connection.query(detailQuery, detailParams);
    }

    await connection.commit();
    res.status(200).send("History and details added successfully.");
  } catch (error) {
    await connection.rollback();
    console.error('Error during transaction:', error);
    res.status(500).send("Error creating history.");
  } finally {
    connection.release();
  }
});

// ################## 이메일 ##################
const { sendMail } = require("./mailer");
const nodeMailer = require("nodemailer");

const getHistory = async (userId) => {
  const query = 'SELECT * FROM Histories WHERE idUser = ? ORDER BY createdAt DESC';
  try {
    const [results] = await pool.query(query, [userId]);
    return results;
  } catch (err) {
    console.error('Error fetching history:', err);
    throw err;
  }
};
const getHistoryDetail = async (historyId) => {
  const query = `
    SELECT hd.*, p.good_name 
    FROM HistoryDetails hd
    JOIN Products p ON hd.productId = p.id
    WHERE hd.historyId = ?
  `;
  try {
    const [results] = await pool.query(query, [historyId]);
    return results;
  } catch (err) {
    console.error('Error fetching history details:', err);
    throw err;
  }
};

app.post("/api/sendMailCheckout", loginchk, async (req, res) => {
  const { fullName, email, phone, address } = req.body;
  const user = req.user;
  const subject = "AAH MALL";
  
  try {
    const userHistory = await getHistory(user.id);
    const recentHistory = userHistory.length > 0 ? userHistory[0] : null;
    if (!recentHistory) {
      return res.status(400).send({ message: "No history found for the user." });
    }

    const historyDetails = await getHistoryDetail(recentHistory.id);
    const total = historyDetails.reduce((total, item) => {
      return total + parseFloat(item.purchasePrice) * parseInt(item.quantity);
    }, 0);

    const htmlHead = `<table style="width:50%">
      <tr style="border: 1px solid black;">
        <th style="border: 1px solid black;">제품명</th>
        <th style="border: 1px solid black;">가격</th>
        <th style="border: 1px solid black;">수량</th>
        <th style="border: 1px solid black;">구매금액</th>
      </tr>`;

    let htmlContent = "";

    for (const detail of historyDetails) {
      const productName = detail.good_name || "Unknown Product";
      const price = detail.purchasePrice;
      const count = detail.quantity;
      const totalPrice = parseFloat(price) * parseInt(count);

      htmlContent += `<tr>
        <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
          ${productName}
        </td>
        <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
          ${price}₩
        </td>
        <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
          ${count}
        </td>
        <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
          ${totalPrice}₩
        </td>
      </tr>`;
    }

    const htmlResult = `
      <h1>안녕하세요 ${fullName}님</h1>
      <h3>Phone: ${phone}</h3>
      <h3>Address: ${address}</h3>
      <h3>입금하실 계좌정보 : 카카오뱅크 3333-27-5746222 예금주:씨포이아이(C4EI)</h3>
      <h3>총 결제금액: ${total} ₩</h3>
      ${htmlHead}
      ${htmlContent}
      </table>
      <p>감사합니다!</p>
    `;

    const info = await sendMail(email, subject, htmlResult);
    res.status(200).send({ sendEmail: nodeMailer.getTestMessageUrl(info) });
  } catch (err) {
    console.error("Error during email sending:", err);
    res.status(500).send("Error during email sending");
  }
});

// ###################### cart, history, 이메일 ######################

// ###################### History 조회 및 업데이트 ######################
// 히스토리 조회 엔드포인트
app.get('/api/history', isAdmin, async (req, res) => {
  const { search = '', page = 1 } = req.query;
  const limit = 15;
  const offset = (page - 1) * limit;

  const searchPattern = `%${search}%`;

  const dataQuery = `
    SELECT * FROM Histories
    WHERE fullname LIKE ? OR address LIKE ? OR phone LIKE ? OR memo LIKE ?
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;
  
  const countQuery = `
    SELECT COUNT(*) as total FROM Histories
    WHERE fullname LIKE ? OR address LIKE ? OR phone LIKE ? OR memo LIKE ?
  `;

  try {
    const [dataResults] = await pool.query(dataQuery, [searchPattern, searchPattern, searchPattern, searchPattern, limit, offset]);
    const [[{ total }]] = await pool.query(countQuery, [searchPattern, searchPattern, searchPattern, searchPattern]);

    res.json({
      data: dataResults,
      total,
    });
  } catch (err) {
    console.error('히스토리 조회 오류:', err);
    res.status(500).send('서버 오류가 발생했습니다.');
  }
});


// 히스토리 업데이트 엔드포인트
app.put('/api/history/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { delivery, status } = req.body;

  const query = `
    UPDATE Histories 
    SET delivery = ?, status = ?, updatedAt = ? 
    WHERE id = ?
  `;
  try {
    await pool.query(query, [delivery, status, new Date(), id]);
    res.status(200).send('히스토리가 성공적으로 업데이트되었습니다.');
  } catch (err) {
    console.error('히스토리 업데이트 오류:', err);
    res.status(500).send('서버 오류가 발생했습니다.');
  }
});
// ###################### History 조회 및 업데이트 ######################

// // yarn add gpt4free-client
// const GptClient = require('gpt4free-client');
// async function generateText(msg) {
//   // Create chat completion
//   const completion = await GptClient.create({
//       model: 'gpt-4-0613',
//       temperature: 0.7,
//       // systemPrompt: 'You are powerful AI assistant\n',
//       systemPrompt: '한국어로해줘\n',
//       messages: [
//           {
//               role: 'system',
//               messages: msg
//           }
//       ]
//   });
  
//   // Get generated text
//   const generatedText = await completion;
  
//   // console.log(generatedText);
//   return generatedText;
// }
// ###################### chatGPT ######################
const { G4F } = require("g4f");
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
      //4 yarn add g4f
      // https://github.com/c4ei/g4f-ts
      const g4f = new G4F();
      const messages = [
          { role: "user", content: prompt}
      ];
      // const chatbotResponse = await g4f.chatCompletion(messages).then(console.log);
      const chatbotResponse = await g4f.chatCompletion(messages);
      res.json({ generatedText: chatbotResponse });
      // g4f.chatCompletion(messages).then(console.log);
      
      //3  gpt4free 모델 npm
      // let _aiMsg = await generateText(prompt);
      // res.json({ generatedText: _aiMsg });
      // console.log(`Sending message: ${prompt}`);

      //2  gpt4free 모델 
      /*
      const response = await axios.get('http://localhost:1337/v1/chat/completions', {
        "model": "gpt-3.5-turbo-16k",
        "stream": false,
        "messages": [
            {"role": "assistant", "content": prompt}
        ]
      });
      const chatbotResponse = response.data.response;
      res.json({ generatedText: chatbotResponse });
      */
      //1  작동하나 중국어 모델 
      /*
      const response = await axios.get('http://localhost:5000/api/v1/chatbot', {
        params: { message: prompt }
      });
      // const chatbotResponse = response.data.response;
      console.log("chatbotResponse : "+chatbotResponse);
      res.json({ generatedText: chatbotResponse });
      */
      
  } catch (error) {
      console.error(error);
  }
});
// ###################### chatGPT ######################


const publicPathDirectory = path.join(__dirname, "public");
app.use(express.static(publicPathDirectory));


const jwt = require("jsonwebtoken");
function loginchk(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).send("No refresh token found, please login.");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).send("Token is not valid.");
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).send("You're not authenticated" + err);
  }
};

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

app.get('/', function(req,resp){
  resp.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

adminRoutes.forEach(route => {
  app.get(route, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
});

app.get('*', function (req, resp) {
  resp.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 3021;

httpServer.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
