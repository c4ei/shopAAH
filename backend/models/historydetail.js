// /shop.c4ei.net/backend/models/historydetail.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HistoryDetail extends Model {
    static associate({ History, Product }) {
      HistoryDetail.belongsTo(History, { foreignKey: "historyId" });
      HistoryDetail.belongsTo(Product, { foreignKey: "productId" });
    }
  }
  HistoryDetail.init(
    {
      historyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchasePrice: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "HistoryDetail",
      timestamps: true,
    }
  );
  return HistoryDetail;
};
