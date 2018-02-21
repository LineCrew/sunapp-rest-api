import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';
/**
 * 사용자 관련 엔티티 정의
 */
const userEntity = sequelize.define('userQuestions', {
  content: { type: DataTypes.STRING },
});

export default userEntity;
