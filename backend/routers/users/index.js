// /shop.c4ei.net/backend/routers/users/index.js
const express = require("express");
const jwt = require("jsonwebtoken");
const OAuth2Client = require("google-auth-library");
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
      secure: false,
      path: "/",
      sameSite: "strict",
    });

    refreshTokens.push(refresh);
    const { password, ...others } = user.dataValues;
    res.status(200).send({ ...others, token });
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
      secure: false,
      path: "/",
      sameSite: "strict",
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
// https://shop.c4ei.net/api/v1/users/google?code=111
userRouter.get("/google", async (req, res) => {
  const code = req.query.code;
  console.log("line 292 [/backend/routers/users/index.js] code:"+code);
});
// https://shop.c4ei.net/api/v1/users/google
userRouter.post("/google", async (req, res) => {
  console.log("line 295 [/backend/routers/users/index.js] req.body.code : " + req.body.code);

  let goo_data = await GoogleOAuth2RedirectPage(req.body.code);
  console.log( goo_data +" : goo_data");
  // front에서 넘어온 code를 정리합니다.
  
  // const oAuth2Client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID, process.env.REACT_APP_GOOGLE_SECRET_KEY, "postmessage");
  // const {tokens} = await oAuth2Client.getToken(req.body.code);
  // console.log("code ", tokens);
  // res.send(tokens);

});

// 구글로그인은 email로 로그인 처리
userRouter.post("/googlelogin", async (req, res) => {
  const {email, fullname} = req.body;
  console.log("line 311 [/backend/routers/users/index.js] req.body.email : " + email +" / fullname : " + fullname);
  let msg = "";
  const user = await getUserByEmail(email);
  if (!user) {
    msg = "reg";
    let password = "asdf1234";
    const hashedPassword = await hashPassword(password);
    const user = await createUser({
      fullname,
      email,
      password: hashedPassword,
      phone,
      referrer_id,
    });
  } else{
    msg = "login";
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
    
    const refresh = genrefreshToken({
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
      secure: false,
      path: "/",
      sameSite: "strict",
    });

    refreshTokens.push(refresh);
  }
  console.log("##################################################################################################");
  console.log("line 361 [/backend/routers/users/index.js] msg : " + msg );
  console.log("##################################################################################################");
  return msg;
});

async function GoogleOAuth2RedirectPage(code) {
  // 1. 인가코드
  // const code = new URL(window.location.href).searchParams.get("code");
  // 2. access Token 요청
  // const getToken = async (code) => {
      const REST_API_KEY = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
      const SECRET_KEY = process.env.REACT_APP_GOOGLE_SECRET_KEY;
      const response = await fetch(`https://oauth2.googleapis.com/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&client_secret=${SECRET_KEY}&code=${code}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
      });
      // "email": "elisa.g.beckett@gmail.com", // The user's email address
      // "name": "Elisa Beckett",
      
      console.log(JSON.stringify(response.json()) +" : 323 ");
      console.log(response.data.email +" : response.data.email");
      return response.json();
  // }

  // useEffect(() => { if (code) { getToken(code).then((res) => { console.log(res.access_token); }) } }, []);
  // return true;
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

  const refresh = genrefreshToken({
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
    secure: false,
    path: "/",
    sameSite: "strict",
  });

  refreshTokens.push(refresh);
  const { password, ...others } = user.dataValues;
  res.status(200).send({ ...others, token });

  res.redirect("/");
});


// ###################### oAuth /backend/routers/users/index.js ######################

module.exports = userRouter;
