import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * 사용자 관련 엔티티 정의
 */
const administratorEntity = sequelize.define('administrator', {
  account: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  type: { type: DataTypes.ENUM, values: ['admin', 'user'] },
  password: { type: DataTypes.STRING },
});

export default administratorEntity;
