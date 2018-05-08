import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * FAQ 에 대한 Entity 정의
 */
const faqEntity = sequelize.define('faq', {
  topic: { type: DataTypes.STRING, allowNull: false },
  question: { type: DataTypes.STRING, allowNull: false },
  answer: { type: DataTypes.STRING, allowNull: false },
});

export default faqEntity;
