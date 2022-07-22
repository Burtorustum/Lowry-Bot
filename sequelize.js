import * as Sequelize from 'sequelize';

export const sequelize = new Sequelize.Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

export const Tags = sequelize.define('tags', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.STRING,
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});
