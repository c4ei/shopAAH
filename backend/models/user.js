// /shop.c4ei.net/backend/models/user.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Cart, Comment, History, Messenger, Converstation }) {
      User.hasOne(Cart, {
        foreignKey: "idUser",
        as: "cart",
      });
      User.hasOne(Comment, {
        foreignKey: "idUser",
        as: "comment",
      });
      User.hasOne(History, {
        foreignKey: "idUser",
        as: "history",
      });
      User.hasMany(Messenger, { foreignKey: "senderId", as: "sender" });
      User.hasMany(Messenger, { foreignKey: "receiverId", as: "receiver" });
    }
  }

  User.init(
    {
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 30], // 유효성 검사를 len으로 통합하여 최소 2글자, 최대 30글자
            msg: "Fullname must be between 2 and 30 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [10, 50], // 최소 10글자, 최대 50글자
            msg: "Email must be between 10 and 50 characters",
          },
          isEmail: {
            msg: "Must be a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 255], // 최소 6글자, 최대 255글자
            msg: "Password must be between 6 and 255 characters",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]+$/,
            msg: "Phone must contain only numbers",
          },
        },
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      referrer_id: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[0-9]+$/,
            msg: "Referrer ID must contain only numbers",
          },
        },
      },
      reward_points: {
        type: DataTypes.DECIMAL(10, 2), // Decimal 형식으로 변경
        allowNull: true,
        validate: {
          isDecimal: {
            msg: "Reward points must be a decimal number",
          },
        },
      },
      // 새로운 필드 추가
      address1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
