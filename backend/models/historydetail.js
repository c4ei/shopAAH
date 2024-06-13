"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HistoryDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ History, Product }) {
      // define association here
      HistoryDetail.belongsTo(History, { foreignKey: "historyId" });
      HistoryDetail.belongsTo(Product, { foreignKey: "productId" });
    }
  }
  HistoryDetail.init(
    {
      historyId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      purchasePrice: DataTypes.DECIMAL(20, 2),
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "HistoryDetail",
    }
  );
  return HistoryDetail;
};
