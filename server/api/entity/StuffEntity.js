import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

const stuffEntity = sequelize.define('stuffs', {
  subject: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  condition: { type: DataTypes.INTEGER },
});

export default stuffEntity;
