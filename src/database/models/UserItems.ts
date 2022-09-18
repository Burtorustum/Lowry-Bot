import {INTEGER, STRING} from 'sequelize';
import sequelize from '../define-sequelize-model.js';

export default sequelize.define('user_item', {
  user_id: STRING,
  item_id: INTEGER,
  amount: {
    type: INTEGER,
    allowNull: false,
    // @ts-ignore
    'default': 0
  }
}, {
  timestamps: false
});