import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * Questionaire (문제지) 가 가지고 있는 각각의 문제들에 관한 Entity
 */
const questionItemEntity = sequelize.define('questionItem', {
  number: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  example: { type: DataTypes.TEXT, allowNull: false },
  case1: { type: DataTypes.TEXT, allowNull: false },
  case2: { type: DataTypes.TEXT, allowNull: false },
  case3: { type: DataTypes.TEXT, allowNull: false },
  case4: { type: DataTypes.TEXT, allowNull: false },
  case5: { type: DataTypes.TEXT, allowNull: false },
  answer: { type: DataTypes.INTEGER, allowNull: false },
  limitTime: { type: DataTypes.INTEGER, allowNull: false },
});

export default questionItemEntity;
