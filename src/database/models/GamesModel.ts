import {STRING} from 'sequelize';
import sequelizeModel from '../define-sequelize-model.js';

const GamesModel = sequelizeModel.define('games', {
  name: {
    type: STRING,
    unique: true
  },
  player: {
    type: STRING
  },
  status: {
    type: STRING
  }
});
export default GamesModel;