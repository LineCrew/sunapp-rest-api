import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';
/**
 * 사용자 관련 엔티티 정의
 */
const userEntity = sequelize.define('user', {
  nickname: { type: DataTypes.STRING, unique: true },
  accessToken: { type: DataTypes.STRING, allowNull: true },
  facebookUserId: { type: DataTypes.STRING },
  loginType: { type: DataTypes.ENUM, values: ['signUp', 'facebook'] },
  userType: { type: DataTypes.ENUM, values: ['admin', 'user'] },
  registrationId: { type: DataTypes.STRING, allowNull: true },
  character: { type: DataTypes.ENUM, values: ['om', 'ym', 'ow', 'yw'] },
  star: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  heart: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
  email: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: true },
  gender: { type: DataTypes.STRING, allowNull: true },
  birth: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
});

export default userEntity;
