import * as Sequelize from 'sequelize';

const sequelizeModel = new Sequelize.Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

export default sequelizeModel;