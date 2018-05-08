import { UserEntity, UserAnswerEntity, GameResultEntity } from '../entity';
import sequelize from '../../common/dbConfig';

const Op = sequelize.Op;
const week = 24 * 60 * 60 * 1000 * 7;

export default class RankModel {
  constructor(data = {}) {
    this.rankType = data.rankType;
  }

  /**
   * 3 가지 케이스 존재 -> 포인트, 랜덤 게임, 친구 게임, 승패
   */
  async getRankByType(state = {}) {
    if (this.rankType === 'gameResult') {
      const result = await GameResultEntity.findAll({
        attributes: { include: [[sequelize.fn('COUNT', sequelize.col('winnerUserId.id')), 'winCount']] },
        include: [{
          model: UserEntity,
          as: 'users',
        }],
        where: {
          createdAt: {
            [Op.lt]: new Date(),
            [Op.gt]: new Date(new Date() - week),
          },
        },
        group: 'winnerUserId.id',
        limit: state.limit,
        order: [['winCount', 'DESC']],
      });

      return result;
    } else if (this.rankType === 'point') {
      // TODO: UserAnswerEntity -> User 로 관계를 바꿔야함.
      const result = UserAnswerEntity.findAll({
        attributes: { include: [[sequelize.fn('COUNT', sequelize.col('users.id')), 'answerCount']] },
        include: [{
          model: UserEntity,
          as: 'users',
        }],
        where: {
          isCorrect: true,
          createdAt: {
            [Op.lt]: new Date(),
            [Op.gt]: new Date(new Date() - week),
          },
        },
        group: 'users.id',
        limit: state.limit,
        order: [['answerCount', 'DESC']],
      });

      return result;
    } else if (this.rankType === 'friend') {
      const result = UserEntity.findAll({
      });
    }
  }
}
