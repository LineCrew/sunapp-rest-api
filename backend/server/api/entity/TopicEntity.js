import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * Topic 에 대한 Entity 정의
 * 예: 9급 공무원, 7급 공무원
 */
const topicEntity = sequelize.define('topic', {
  topicName: { type: DataTypes.STRING, allowNull: false },
});

export default topicEntity;
