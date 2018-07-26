import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * Questionaire (문제지) 가 가지고 있는 각각의 문제들에 관한 Entity
 */
const questionItemEntity = sequelize.define('questionItem', {
  number: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.STRING, allowNull: false },
  example: { type: DataTypes.STRING, allowNull: false },
  case1: { type: DataTypes.STRING, allowNull: false },
  case2: { type: DataTypes.STRING, allowNull: false },
  case3: { type: DataTypes.STRING, allowNull: false },
  case4: { type: DataTypes.STRING, allowNull: false },
  answer: { type: DataTypes.INTEGER, allowNull: false },
  limitTime: { type: DataTypes.INTEGER, allowNull: false },
});

export default questionItemEntity;
