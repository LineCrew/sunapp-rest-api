import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * 문제 신고 에 대한 Entity 정의
 */
const problemEntity = sequelize.define('problem', {
  question: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  uploadFile: { type: DataTypes.STRING, allowNull: false },
});

export default problemEntity;
