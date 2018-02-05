import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * 광고 엔티티
 */

const AdvertiseEntity = sequelize.define('advertise', {
  order: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  advertiser: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.STRING, allowNull: false },
  star: { type: DataTypes.INTEGER, allowNull: false },
  link: { type: DataTypes.STRING, allowNull: false },
});

export default AdvertiseEntity;
