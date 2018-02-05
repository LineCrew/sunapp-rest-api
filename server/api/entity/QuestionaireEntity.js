import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

/**
 * Questionaire (문제지) 에 대한 Entity 정의
 * 예: 9급 공무원의 국어 1 문제지
 */
const questionaireEntity = sequelize.define('questionaire', {
  questionaireName: { type: DataTypes.STRING, allowNull: false },
});

export default questionaireEntity;
