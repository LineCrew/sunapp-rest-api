import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';
/**
 * 사용자 관련 엔티티 정의
 */
const administratorEntity = sequelize.define('administrator', {
  name: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  type: { type: DataTypes.ENUM, values: ['admin', 'user'] },
});

export default administratorEntity;
