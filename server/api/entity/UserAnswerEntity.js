import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * 사용자가 풀었던 문제에 대한 데이터를 기록하는 엔티티
 */
const userAnswerEntity = sequelize.define('answer', {
  answer: { type: DataTypes.INTEGER, allowNull: false },
  solvedTime: { type: DataTypes.INTEGER },
  isCorrect: { type: DataTypes.BOOLEAN, allowNull: false },
  gameType: { type: DataTypes.ENUM, allowNull: false, values: ['random', 'single', 'friend'] },
});

export default userAnswerEntity;
