import redis from '../../../common/redisConfig';
import sequelize from '../../../common/dbConfig';
import l from '../../../common/logger';
import { AdministratorModel, ApiResultModel } from '../../domain';
import { AdministratorEntity } from '../../entity';

/**
 * Controller of Admin Domain.
 */
class Controller {
  /**
   * 고객의 Q&A 에 대한 답변
   * @param {*} req
   * @param {*} res
   */
  async sendProblemAnswer(req, res) {
    try {
      redis.lpush(`user-problem-answer-${req.body.userId}`, req.body.answer);
      res.status(200).send(new ApiResultModel({ statusCode: 200 }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 메시지와 함께 별을 보낸다.
   * @param {*} req
   * @param {*} res
   */
  async sendStarWithMessage(req, res) {
    try {
      const result = await sequelize.query(`update users set star = star + ${req.body.star} where id in (${req.body.userIds.toString()});`);
      req.body.userIds.forEach(async id => {
        redis.lpush(`user-notification-${id}`, req.body.message.toString());
        await redis.expire(`user-notification-${id}`, 60 * 60 * 24); // 하루 동안 보관
      });
      res.status(200).send(result[0]);
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 관리자 계정을 생성한다.
   * @param {*} req
   * @param {*} res
   */
  async insertAdministrator(req, res) {
    try {
      const administratorModel = new AdministratorModel(req.body);
      const generatedAdminEntity = await AdministratorEntity.create(administratorModel);
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: generatedAdminEntity }));
    } catch (e) {
      l.error(e);
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 관리자 계정 로그인
   * @param {*} req
   * @param {*} res
   */
  async loginAdministrator(req, res) {
    try {
      const model = {
        where: {
          account: req.body.account,
          password: req.body.password,
          type: req.body.type,
        },
      };

      const result = await AdministratorEntity.findOne(model);
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      l.error(e);
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 모든 사용자의 탈퇴 기록을 조회한다.
   * @param {*} req
   * @param {*} res
   */
  async getWithdrawalHistory(req, res) {
    redis.keys('user-withdrawal-*', (err, keys) => {
      const withdrawalItems = [];
      keys.forEach((key, pos) => {
        redis.hgetall(key, (err, obj) => {
          withdrawalItems.push(obj);
          if (keys.length - 1 === pos) {
            console.log(withdrawalItems);
            res.status(200).send(new ApiResultModel({ statusCode: 200, message: withdrawalItems }));
          }
        });
      });
    });
  }

  /**
   * 모든 사용자의 최근 접속 기록 조회
   * @param {*} req
   * @param {*} res
   */
  async getUserConnectionHistory(req, res) {
    redis.keys('user-connect-*', (err, keys) => {
      const connectionItems = [];
      keys.forEach((key, pos) => {
        redis.hgetall(key, (err, obj) => {
          connectionItems.push(obj);
          if (keys.length - 1 === pos) {
            console.log(connectionItems);
            res.status(200).send(new ApiResultModel({ statusCode: 200, message: connectionItems }));
          }
        });
      });
    });
  }
}

export default new Controller();
