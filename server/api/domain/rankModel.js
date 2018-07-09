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
        'select *, count(*) as winCount from gameResults as g left outer join users as u on u.id = g.winnerUserId where g.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW() group by g.winnerUserId order by winCount desc;',
      );

      return targetRankEntities[0];
    } else if (this.rankType === 'single') {
      const targetRankEntities = await sequelize.query(`select *, count(*) as answerCount, user_id from answers as a left outer join users as u on u.id = a.user_id where a.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW() and a.isCorrect = true and a.gameType = '${this.rankType}' group by user_id order by answerCount desc;`);

      return targetRankEntities[0];
    }
  }

  /**
   * 사용자의 전적 조회 함수
   * @param {*} userId
   */
  async getUserPlayingHistory(userId) {
    const targetWinHistoryEntity = await sequelize.query(
      `select count(*) as winCount from gameResults as g left outer join users as u on u.id = g.winnerUserId where g.winnerUserId = ${userId} group by g.winnerUserId;`,
    );

    const targetLoseHistoryEntity = await sequelize.query(
      `select count(*) as loseCount from gameResults as g left outer join users as u on u.id = g.loserUserId where g.loserUserId = ${userId} group by g.loserUserId;`,
    );

    const response = {
      winHistory: targetWinHistoryEntity,
      loseHistory: targetLoseHistoryEntity,
    };

    return response;
  }
}
