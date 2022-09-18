import {INTEGER, STRING} from 'sequelize';
import sequelize from '../define-sequelize-model.js';

export default sequelize.define('currency_shop', {
  name: {
    type: STRING,
    unique: true
  },
  cost: {
    type: INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});