import UserEntity from './UserEntity';
import GameEntity from './GameEntity';
import TopicEntity from './TopicEntity';
import QuestionaireEntity from './QuestionaireEntity';
import QuestionItemEntity from './QuestionItemEntity';
import UserAnswerEntity from './UserAnswerEntity';
import GameResultEntity from './GameResultEntity';
import FaqEntity from './FaqEntity';
import ProblemEntity from './ProblemEntity';
import AdvertiseEntity from './AdvertiseEntity';
import AdvertiseHistoryEntity from './AdvertiseHistoryEntity';
import StuffEntity from './StuffEntity';
import GivenStuffEntity from './GivenStuffEntity';
import stuffEntity from './StuffEntity';

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

AdvertiseEntity.hasMany(AdvertiseHistoryEntity, { as: 'advertiseItem' });

UserAnswerEntity.belongsTo(UserEntity, { as: 'user' });
UserAnswerEntity.belongsTo(QuestionItemEntity, { as: 'item' });

GameResultEntity.belongsTo(QuestionaireEntity, { as: 'questionaires' });
GameResultEntity.belongsTo(UserEntity, { foreignKey: 'winnerUserId', as: 'winnerUser' });
GameResultEntity.belongsTo(UserEntity, { foreignKey: 'loserUserId', as: 'loserUser' });

AdvertiseHistoryEntity.belongsTo(UserEntity, { as: 'users' });

// UserEntity.hasMany(StuffEntity, { as:  })
GivenStuffEntity.belongsTo(StuffEntity, { as: 'stuff' });

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
  AdvertiseEntity,
  AdvertiseHistoryEntity,
};
