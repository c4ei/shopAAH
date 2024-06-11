"use strict";
const { User } = require("../../models");

const createUser = async (user) => {
  try {
    const newUser = await User.create(user);
    return newUser;
  } catch (err) {
    console.log(err);
  }
};

// const createUser = async (user) => {
//   try {
//     // 전화번호 중복 체크
//     const existingUser = await User.findOne({ where: { phone: user.phone } });

//     if (existingUser) {
//       throw new Error("Phone number is already in use");
//     }

//     // 이메일 중복 체크 (선택 사항, 이미 unique로 설정된 경우 생략 가능)
//     const existingEmailUser = await User.findOne({ where: { email: user.email } });

//     if (existingEmailUser) {
//       throw new Error("Email is already in use");
//     }

//     // 중복되지 않는 경우 사용자 생성
//     const newUser = await User.create(user);
//     return newUser;
//   } catch (error) {
//     console.error(error); // 오류 로그 추가
//     throw error;
//   }
// };

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
  }
};

const getListUser = async () => {
  try {
    const listUser = await User.findAll();
    return listUser;
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (id) => {
  try {
    const userDeleted = await User.destroy({
      where: {
        id,
      },
    });
    return userDeleted;
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (id, data) => {
  try {
    const updateUser = await User.update(data, {
      where: {
        id,
      },
    });
    return updateUser;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getListUser,
  deleteUser,
  getUserById,
  updateUser,
};
