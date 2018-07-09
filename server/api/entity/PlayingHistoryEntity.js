
import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * 게임 플레이 기록에 대한 엔티티
 * 승패 여부 및 상대방과 플레이한 Room Id 가 존재함.
 */
const playingHistory = sequelize.define('playingHistory', {
  roomId: { type: DataTypes.STRING, allowNull: false },
  result: { type: DataTypes.STRING, allowNull: false },
});

export default playingHistory;
