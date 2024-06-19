// /shop.c4ei.net/backend/migrations/20240619145934-add-rating-to-product.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      good_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        collate: 'utf8mb4_unicode_ci'
      },
      price: {
        type: Sequelize.STRING(20),
        allowNull: false,
        collate: 'utf8mb4_unicode_ci'
      },
      img1: {
        type: Sequelize.STRING(255),
        allowNull: true,
        collate: 'utf8mb4_unicode_ci'
      },
      img2: {
        type: Sequelize.STRING(255),
        allowNull: true,
        collate: 'utf8mb4_unicode_ci'
      },
      img3: {
        type: Sequelize.STRING(255),
        allowNull: true,
        collate: 'utf8mb4_unicode_ci'
      },
      img4: {
        type: Sequelize.STRING(255),
        allowNull: true,
        collate: 'utf8mb4_unicode_ci'
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true,
        collate: 'utf8mb4_unicode_ci'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.STRING(8000),
        allowNull: true,
        defaultValue: '',
        collate: 'utf8mb4_unicode_ci'
      },
      originalPrice: {
        type: Sequelize.DECIMAL(20, 0),
        allowNull: true
      },
      promotionPercent: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ORG_ITEM: {
        type: Sequelize.STRING(150),
        allowNull: true,
        collate: 'utf8mb4_unicode_ci'
      },
      GDS_DESC: {
        type: Sequelize.STRING(6000),
        allowNull: true,
        collate: 'utf8mb4_unicode_ci'
      },
      GDS_PRICE_ORG: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      PRICE_UP_DATE: {
        type: Sequelize.DATE,
        allowNull: true
      },
      GDS_AAH_PRICE: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
        comment: 'AAH 상품 가격'
      },
      GDS_STOCK: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      rating: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
