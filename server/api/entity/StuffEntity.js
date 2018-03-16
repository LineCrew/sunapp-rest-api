import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

const stuffEntity = sequelize.define('stuffs', {
  subject: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN },
});

export default stuffEntity;
