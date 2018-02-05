import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
);

module.exports = sequelize;
