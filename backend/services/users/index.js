"use strict";
const { User } = require("../../models");

const createUser = async (user) => {
  try {
    const newUser = await User.create(user);
    return newUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

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
    throw err;
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
    throw err;
  }
};

const getListUser = async () => {
  try {
    const listUser = await User.findAll();
    return listUser;
  } catch (err) {
    console.log(err);
    throw err;
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
    throw err;
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
    throw err;
  }
};

const getUserByPhone = async (phone) => {
  try {
    const user = await User.findOne({
      where: {
        phone,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getUserByFullname = async (fullname) => {
  console.log("/backend/services/users/index.js 95 Line - getUserByFullname : " + fullname);
  try {
    const user = await User.findOne({
      where: {
        fullname,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

async function checkFullname(fullname) {
  try {
    const user = await User.findOne({ where: { fullname } });
    if (user) {
      return { message: '이름이 이미 사용 중입니다.' };
    } else {
      return { message: '사용 가능한 이름입니다.' };
    }
  } catch (error) {
    throw new Error('중복 확인 중 오류가 발생했습니다.');
  }
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserByPhone,
  getUserByFullname,
  getListUser,
  deleteUser,
  getUserById,
  updateUser,
  checkFullname,
};
