import { UserEntity, GameResultEntity, UserAnswerEntity, GameEntity, TopicEntity, QuestionaireEntity } from '../../entity/';
import { ApiResultModel, GameModel, RankModel } from '../../domain/';

/**
 * Controller of User Domain.
 */
class Controller {
  /**
   * 사용자 게임 플레이 전적 조회
   * @param {*} req
   * @param {*} res
   */
  async getUserPlayingHistory(req, res) {
    try {
      const rankModel = new RankModel();
      const response = await rankModel.getUserPlayingHistory(req.params.userId);
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: response }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 게임 결과를 저장한다.
   * @param {*} req 
   * @param {*} res 
   */
  async setGameResult(req, res) {
    try {
      const winnerUserEntity = await UserEntity.findById(req.body.winnerUserId);
      const loserUserEntity = await UserEntity.findById(req.body.loserUserId);

      const generatedGameResultEntity = await GameResultEntity.create();
      await generatedGameResultEntity.setWinnerUser(winnerUserEntity);
      await generatedGameResultEntity.setLoserUser(loserUserEntity);

      res.status(200).send(new ApiResultModel({ statusCode: 200 }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * sort된 주간 승패 탑 50 가져오기
   * sort된 주간 점수 탑 10 가져오기
   * 저번주 승패 랭킹 10 가져오기
   * sort된 포인트 점수 탑 50 가져오기
   * @param {*} req 
   * @param {*} res 
   */
  async getGameRank(req, res) {
    try {
      const rankType = req.query.rankType;
      const targetRankModel = new RankModel({ rankType });
      // 3 가지 케이스 존재 -> 포인트, 랜덤 게임, 친구 게임, 승패
      // if (targetRankModel.)

      // GroupBy 를 통하여 UserId 로 모은 후, 정답별로 Sort 할 것

      const result = await targetRankModel.getRankByType(req.query.limit);
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 게임 엔티티들을 가지고 온다.
   * @param {*} req
   * @param {*} res
   */
  async getAllGameList(req, res) {
    try {
      const result = await GameEntity
        .findAll({
          include: [{
            model: TopicEntity,
            as: 'topics',
            include: [{
              model: QuestionaireEntity,
              as: 'questionaires',
            }],
          }],
        });

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 게임을 새로 생성하도록 한다.
   * @param {*} req
   * @param {*} res
   */
  async post(req, res) {
    const gameModel = new GameModel(req.body);

    try {
      const result = await GameEntity.create(gameModel);
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 게임 ID 에 따른 Topic 들의 목록을 가져온다.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getGameById(req, res) {
    const gameId = req.params.gameId;

    try {
      const result = await GameEntity
        .findById(gameId, {
          include: [{
            model: TopicEntity,
            as: 'topics',
          }],
        });

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }
}

export default new Controller();
