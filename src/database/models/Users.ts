import {INTEGER, STRING} from 'sequelize';
import sequelize from '../define-sequelize-model.js';

export default sequelize.define('users', {
  user_id: {
    type: STRING,
    primaryKey: true
  },
  balance: {
    type: INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  timestamps: false
});