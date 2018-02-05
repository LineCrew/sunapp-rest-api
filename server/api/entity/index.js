import UserEntity from './UserEntity';
import GameEntity from './GameEntity';
import TopicEntity from './TopicEntity';
import QuestionaireEntity from './QuestionaireEntity';
import QuestionItemEntity from './QuestionItemEntity';
import UserAnswerEntity from './UserAnswerEntity';
import GameResultEntity from './GameResultEntity';
import FaqEntity from './FaqEntity';
import ProblemEntity from './ProblemEntity';

/**
 * GameEntity -> TopicEntity -> QuestionaireEntity -> QuestionItemEntity 식으로 관계가 정의된다.
 * GameEntity -> TopicEntity = 1:m
 * TopicEntity -> QuestionaireEntity = 1:m
 * QuestionaireEntity -> QuestionItemEntity = 1:m
 */

GameEntity.hasMany(TopicEntity, { as: 'topics' });

TopicEntity.hasMany(QuestionaireEntity, { as: 'questionaires' });

QuestionaireEntity.hasMany(QuestionItemEntity, { as: 'items' });

UserEntity.hasMany(UserAnswerEntity, { as: 'userAnswers' });

UserAnswerEntity.belongsTo(UserEntity, { as: 'users' });
UserAnswerEntity.belongsTo(QuestionItemEntity, { as: 'items' });

GameResultEntity.belongsTo(QuestionaireEntity, { as: 'questionaires' });
GameResultEntity.belongsTo(UserEntity, { foreignKey: 'winnerUserId', as: 'winnerUser' });
GameResultEntity.belongsTo(UserEntity, { foreignKey: 'loserUserId', as: 'loserUser' });

module.exports = {
  UserEntity,
  GameEntity,
  TopicEntity,
  QuestionaireEntity,
  QuestionItemEntity,
  GameResultEntity,
  UserAnswerEntity,
  FaqEntity,
  ProblemEntity,
};
