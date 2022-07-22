import * as Sequelize from 'sequelize';
import sequelizeModel from './define-sequelize-model.js';

const CounterModel = sequelizeModel.define('counters', {
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
export default CounterModel;