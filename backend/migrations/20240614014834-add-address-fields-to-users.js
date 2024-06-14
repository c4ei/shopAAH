'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'address1', {
      type: Sequelize.STRING(60),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'address2', {
      type: Sequelize.STRING(60),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'postcode', {
      type: Sequelize.STRING(10),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'address1');
    await queryInterface.removeColumn('Users', 'address2');
  }}