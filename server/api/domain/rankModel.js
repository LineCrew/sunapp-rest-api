import sequelize from '../../common/dbConfig';
import l from '../../common/logger';

export default class RankModel {
  constructor(data = {}) {
    this.rankType = data.rankType;
  }

  /**
   * 사용자의 주간 승패, 주간 점수 조회
   * @param {*} data 
   */
  async getCurrentRankByUserId(data = {}) {
    const targetRankEntity = await sequelize.query(
      `SELECT user_id, nickname, winCount, loseCount, rank FROM (SELECT
        user_id,
        nickname,
        winCount,
        loseCount,
        @Rank:=@Rank + 1 AS rank 
        FROM 
          (SELECT 
            nickname,
            user_id,
            count(IF(result='WIN', result, NULL)) AS winCount, 
            count(IF(result='LOSE', result, NULL)) AS loseCount 
            FROM playingHistories p LEFT JOIN users u ON u.id = user_id WHERE DATE(p.created_at) BETWEEN '${data.startDate}' AND '${data.endDate}' GROUP BY user_id ORDER BY winCount DESC
          ) b CROSS JOIN (SELECT @RANK:=0) a) d WHERE d.user_id = ${data.userId}`);

    const targetAnswerRankingEntity = await sequelize.query(
      `SELECT user_id, nickname, answeredCount, rank FROM (SELECT
        user_id,
        nickname,
        answeredCount,
        @Rank:=@Rank + 1 AS rank 
        FROM 
          (SELECT 
            user_id,
            nickname,
            count(*) AS answeredCount
            FROM answers p LEFT JOIN users ON users.id = p.user_id WHERE isCorrect = TRUE AND DATE(p.created_at) BETWEEN '${data.startDate}' AND '${data.endDate}' GROUP BY user_id ORDER BY answeredCount DESC
          ) b CROSS JOIN (SELECT @RANK:=0) a) d WHERE d.user_id = ${data.userId};`,
    );

    const response = {
      targetRankEntity: targetRankEntity[0],
      targetAnswerRankingEntity: targetAnswerRankingEntity[0],
    };

    return response;
  }

  async getRankTopFiftyByType(input = {}) {
    // if (this.rankType === 'gameResult') {
    //   const targetRankEntities = await sequelize.query(
    //     'select *, count(*) as winCount from gameResults as g left outer join users as u on u.id = g.winnerUserId where g.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW() group by g.winnerUserId order by winCount desc;',
    //   );

    //   return targetRankEntities[0];
    // } else if (this.rankType === 'single') {
    //   const targetRankEntities = await sequelize.query(`select *, count(*) as answerCount, user_id from answers as a left outer join users as u on u.id = a.user_id where a.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW() and a.isCorrect = true and a.gameType = '${this.rankType}' group by user_id order by answerCount desc;`);

    //   return targetRankEntities[0];
    // }

    // 주간 순위 50 개를 불러온다.
    if (this.rankType === 'gameRanking') {

      const targetRankEntities = await sequelize.query(
        `SELECT user_id, nickname, winCount, loseCount, rank FROM (SELECT
          user_id,
          nickname,
          winCount,
          loseCount,
          @Rank:=@Rank + 1 AS rank 
          FROM 
            (SELECT 
              nickname,
              user_id,
              count(IF(result='WIN', result, NULL)) AS winCount, 
              count(IF(result='LOSE', result, NULL)) AS loseCount 
              FROM playingHistories p LEFT JOIN users u ON u.id = user_id WHERE DATE(p.created_at) BETWEEN '${input.startDate}' AND '${input.endDate}' GROUP BY user_id ORDER BY winCount DESC
            ) b CROSS JOIN (SELECT @RANK:=0) a) d limit 50`,
      );

      return targetRankEntities[0];
    } else if (this.rankType === 'answerRanking') {
      const targetAnswerRankingEntities = await sequelize.query(
        `SELECT user_id, nickname, answeredCount, rank FROM (SELECT
          user_id,
          nickname,
          answeredCount,
          @Rank:=@Rank + 1 AS rank 
          FROM 
            (SELECT 
              user_id,
              nickname,
              count(*) AS answeredCount
              FROM answers p LEFT JOIN users ON users.id = p.user_id WHERE isCorrect = TRUE AND DATE(p.created_at) BETWEEN '${input.startDate}' AND '${input.endDate}' GROUP BY user_id ORDER BY answeredCount DESC
            ) b CROSS JOIN (SELECT @RANK:=0) a) d LIMIT 50;`,
      );

      return targetAnswerRankingEntities[0];
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
