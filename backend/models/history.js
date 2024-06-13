// /shop.c4ei.net/backend/models/history.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate({ User, HistoryDetail }) {
      History.belongsTo(User, { foreignKey: "idUser" });
      History.hasMany(HistoryDetail, { foreignKey: "historyId" });
    }
  }
  History.init(
    {
      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cart: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      total: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: false,
      },
      delivery: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "History",
      timestamps: true,
    }
  );
  return History;
};
