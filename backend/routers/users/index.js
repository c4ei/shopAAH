// /shop.c4ei.net/backend/routers/users/index.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { authenticate, verifyTokenandAdmin } = require("../../middwares/auth");
const {
  comparePassword,
  hashPassword,
  genToken,
  genrefreshToken,
} = require("../../services/auth");
const {
  createUser,
  getUserByEmail,
  getUserByPhone,
  getUserByFullname,
  getListUser,
  getUserById,
  deleteUser,
  updateUser,
} = require("../../services/users");

const userRouter = express.Router();
const { OAuth2Client } = require('google-auth-library'); // google
const goo_client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // google

let refreshTokens = [];

userRouter.post("/register", async (req, res) => {
  const { fullname, email, password, phone, referrer } = req.body;
  let referrer_id = null;
   // referrer가 이메일 형식인지 확인
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referrer)) {
    try {
      // 이메일에 해당하는 사용자 조회
      const user = await getUserByEmail(referrer);
      if (user) {
        referrer_id = user.id; // 사용자의 ID를 referrer_id로 설정
      }
    } catch (error) {
      console.error("Error finding user by email:", error);
      return res.status(500).send("Error finding user by email");
    }
  } else if (/^\d+$/.test(referrer)) { // referrer가 숫자인 경우
    try {
      // 숫자에 해당하는 사용자 조회
      const user = await getUserById(referrer);
      if (user) {
        referrer_id = user.id; // 사용자의 ID를 referrer_id로 설정
      }
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return res.status(500).send("Error finding user by ID");
    }
  }
  // console.log(`${referrer_id} : referrer_id - /backend/routers/users/index.js`);
  try {
    const hashedPassword = await hashPassword(password);
    const user = await createUser({
      fullname,
      email,
      password: hashedPassword,
      phone,
      referrer_id,
    });

    if (!user) {
      return res.status(500).send("Can't create user");
    }
    res.status(200).send(user);
  } catch (error) {
    console.error("Error creating user:", error); // 상세 로그 추가
    res.status(400).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(404).send("Wrong email!!!");
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    return res.status(404).send("Wrong Password!!!");
  }

  if (user && isValidPassword) {
    await fn_oauth_login(res, user, "c4ei");
  }
});

userRouter.get("/", [authenticate], async (req, res) => {
  const listUser = await getListUser();

  if (!listUser) {
    return res.status(500).send("Can't get list user");
  }

  res.status(200).send(listUser);
});

userRouter.delete(
  "/:id",
  [authenticate, verifyTokenandAdmin],
  async (req, res) => {
    const { id } = req.params;

    const idUserExist = await getUserById(id);

    if (!idUserExist) {
      return res.status(500).send(`User ${id} is not exists in db`);
    }

    const userDeleted = await deleteUser(id);

    res.status(200).send(`User id : ${userDeleted} successfully`);
  }
);

userRouter.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send("You're not authenticate");
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).send("Refresh token is not valid");
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err, user) => {
    if (err) {
      console.log(err);
    }

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = await genToken({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      admin: user.admin, // 추가
    });
    const newRefreshToken = await genrefreshToken({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      admin: user.admin, // 추가
    });

    refreshTokens.push(newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,  // 변경: 'false' -> 'true'
      path: "/",
      sameSite: "lax",  // 변경: 'strict' -> 'lax'
    });

    res.status(200).send({ accessToken: newAccessToken });
  });
});

userRouter.post("/logout", [authenticate], (req, res) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.cookies.refreshToken
  );
  res.status(200).send("Log out is successfully");
});

userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fullname, email, phone, password } = req.body;

  const isExistUser = await getUserById(id);

  if (!isExistUser) {
    res.status(500).send("User is not exists in db");
  }

  const hashedPassword = await hashPassword(password);

  const data = { fullname, email, phone, password: hashedPassword };
  await updateUser(id, data);

  res.status(200).send(data);
});

// ###################### referrer ######################
userRouter.post("/validate-referrer", async (req, res) => {
  const { referrer } = req.body;
  console.log(referrer +" : referrer - /backend/routers/users/index.js");
  try {
    const user = await getUserByEmail(referrer);
    if (user) {
      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ isValid: false, error: "Internal server error" });
  }
});
// ###################### referrer ######################

// ###################### 중복 확인 /backend/routers/users/index.js ######################
userRouter.post("/check-fullname", async (req, res) => {
  const { fullname } = req.body;
  try {
    const user = await getUserByFullname(fullname);
    if (user) {
      return res.status(200).json({ message: "이미 사용 중인 이름입니다. 다른 이름을 입력하세요." });
    }
    return res.status(200).json({ message: "사용 가능한 이름입니다." });
  } catch (error) {
    return res.status(500).json({ message: "이름 확인 중 오류가 발생했습니다." });
  }
});

userRouter.post("/check-email", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(200).json({ message: "이미 사용 중인 이메일입니다. 다른 이메일을 입력하세요." });
    }
    return res.status(200).json({ message: "사용 가능한 이메일입니다." });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ message: "이메일 확인 중 오류가 발생했습니다." });
  }
});

userRouter.post("/check-phone", async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await getUserByPhone(phone);
    if (user) {
      return res.status(200).json({ message: "이미 사용 중인 전화번호입니다. 다른 전화번호를 입력하세요." });
    }
    return res.status(200).json({ message: "사용 가능한 전화번호입니다." });
  } catch (error) {
    console.error("Error checking phone:", error);
    return res.status(500).json({ message: "전화번호 확인 중 오류가 발생했습니다." });
  }
});
// ###################### 중복 확인 /backend/routers/users/index.js ######################

// ###################### oAuth /backend/routers/users/index.js ######################

// 구글로그인은 email로 로그인 처리
async function userExists(email) {
  const user = await getUserByEmail(email);
  if (!user) {
    return false;
  }else{
    return true;
  }
}

async function registerUser(email, fullname){
  let password = process.env.TEMP_USER_PASSWD;
  const hashedPassword = await hashPassword(password);
  let referrer_id = "2";
  let randomNumber8 = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  let phone = "999"+randomNumber8;
  const user = await createUser({
    fullname,
    email,
    password: hashedPassword,
    phone,
    referrer_id,
  });
};

// /backend/routers/users/index.js
userRouter.post("/login_goo_id", async (req, res) => {
  // console.log("Request body:", req.body); // 디버깅을 위해 추가
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).send("Wrong email!!!");
    }

    await fn_oauth_login(res, user);
  } catch (error) {
    console.error("Error in login_goo_id:", error);
    res.status(500).send("Internal Server Error");
  }
});

userRouter.post('/googlelogin', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await goo_client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const fullname = payload.name;
    console.log("line 326 [/backend/routers/users/index.js] payload.email : " + email +" / payload.name : " + fullname );

    if (!await userExists(email)) {
      await registerUser(email, fullname);
    }

    const user = await getUserByEmail(email);
    await fn_oauth_login(res, user , "Google");
    
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(400).json({ error: "Invalid ID token" });
  }
});

// 백엔드 응답 함수 예시
async function fn_oauth_login(res, user , _site) {
  try {
    const token = await genToken({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      admin: user.admin,
      address1: user.address1,
      address2: user.address2,
      postcode: user.postcode,
      address: `${user.address1} ${user.address2} ${user.postcode}`,
    });

    const refresh = await genrefreshToken({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      admin: user.admin,
      address1: user.address1,
      address2: user.address2,
      postcode: user.postcode,
      address: `${user.address1} ${user.address2} ${user.postcode}`,
    });

    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });

    refreshTokens.push(refresh);
    const { password, ...others } = user.dataValues;
    
    if(_site=="Google"){
      res.status(200).json({ status: 'success', data: { ...others }, token });
    }else{
      res.status(200).send({ ...others, token });
    }

  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}


// https://shop.c4ei.net/api/v1/users/kakao
userRouter.get("/kakao/oauth", async (req, res) => {
  console.log("line 289 [/backend/routers/users/index.js] /kakao/oauth");
  const code = req.query.code;
  console.log("line 300 [/backend/routers/users/index.js] code:"+code);

  const kakaoResponse = await axios.post(
    'https://kapi.kakao.com/v2/user/me',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
  idToken = kakaoResponse.data.id;
  name = kakaoResponse.data.kakao_account.profile.nickname;


  // // 2. access Token 요청
  // // const getToken = async (code) => {
  //   const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  //   const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  //   const dataKakao = await fetch(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${code}`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', },
  //   });
  //   console.log("line 303 [/backend/routers/users/index.js] response.json():"+JSON.stringify(dataKakao.json()));
  //   // return res.render("<script>alert('no dataKakao!!!');document.location.href = '/';</script>");
    res.redirect("/");
});

userRouter.post("/kakao", async (req, res) => {
  console.log("req.body : " + JSON.stringify(req.body));
  const { dataKakao } = req.body;
  console.log("line 308 [/backend/routers/users/index.js] code:"+code);
  // return response.json();
  let USER_ID = dataKakao?.data.USER_ID;
  let USER_EMAIL = dataKakao?.data.USER_EMAIL;
  let USER_NAME = dataKakao?.data.USER_NAME;
  let USER_ADDR1 = dataKakao?.data.USER_ADDR1;
  let USER_ADDR2 = dataKakao?.data.USER_ADDR2;
  console.log(USER_EMAIL + " : USER_EMAIL / "+ USER_ID + " : USER_ID / USER_NAME : " + USER_NAME + " / USER_ADDR1 : " + USER_ADDR1 + " / USER_ADDR2 : " + USER_ADDR2 );

  //
  const user = await getUserByEmail(USER_EMAIL);

  if (!user) {
    return res.render("<script>alert('no email!!!');document.location.href = '/';</script>");
    // return res.status(404).send("Wrong email!!!");
  }

  res.redirect("/");
});


// ###################### oAuth /backend/routers/users/index.js ######################

module.exports = userRouter;
