import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
* 게임결과에 관련된 엔티티 정의
*/
const gameResultEntity = sequelize.define('gameResult', {
  // score: { type: DataTypes.INTEGER, allowNull: false },
});

export default gameResultEntity;
