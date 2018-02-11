import { UserEntity, UserAnswerEntity, GameResultEntity } from '../entity';
import sequelize from '../../common/dbConfig';

export default class RankModel {
  constructor(data = {}) {
    this.rankType = data.rankType;
  }

  /**
   * 3 가지 케이스 존재 -> 포인트, 랜덤 게임, 친구 게임, 승패
   */
  async getRankByType(state = {}) {
    if (this.rankType === 'gameResult') {
      const targetRankEntities = await sequelize.query(
        `select 
          *, 
          count(*) as winCount 
        from gameResult as g 
        left outer users as u.id = g.winnerUserId 
        where a.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW() 
        group by g.winnerUserId 
        order by winCount asc`,
      );

      return targetRankEntities[0];
    } else if (this.rankType === 'single') {
      // TODO: UserAnswerEntity -> User 로 관계를 바꿔야함.
      const targetRankEntities = await sequelize.query(`select *, count(*) as answerCount, user_id from answers as a left outer join users as u on u.id = a.user_id where a.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW() and a.isCorrect = true and a.gameType = '${this.rankType}' group by user_id order by answerCount asc;`);

      return targetRankEntities[0];
    }
  }
}
