import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * Game 에 대한 Entity 정의
 * 예: 공무원의 신, 자격증의 신
 */
const gameEntity = sequelize.define('game', {
  gameName: { type: DataTypes.STRING, allowNull: false },
});

export default gameEntity;
