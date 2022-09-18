import {STRING} from 'sequelize';
import sequelizeModel from '../define-sequelize-model.js';

const GIFModel = sequelizeModel.define('usedgifs', {
  url: {
    type: STRING,
    unique: true
  }
});
export default GIFModel;