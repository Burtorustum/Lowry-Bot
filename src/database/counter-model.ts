import {INTEGER, STRING} from 'sequelize';
import sequelizeModel from './define-sequelize-model.js';

const CounterModel = sequelizeModel.define('counters', {
  name: {
    type: STRING,
    unique: true,
  },
  description: STRING,
  count: {
    type: INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});
export default CounterModel;