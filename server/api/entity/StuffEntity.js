import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

const stuffEntity = sequelize.define('stuffs', {
  eventImage: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  active: { type: DataTypes.INTEGER }, // 0: 비활 1: 활성화
  status: { type: DataTypes.INTEGER }, // 0: 아무데도 속하지 않음 1: 이번주 2: 다음주
});

export default stuffEntity;
