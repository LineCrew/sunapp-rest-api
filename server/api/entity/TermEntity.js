import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

const termEntity = sequelize.define('terms', {
  term: { type: DataTypes.STRING },
});

export default termEntity;
