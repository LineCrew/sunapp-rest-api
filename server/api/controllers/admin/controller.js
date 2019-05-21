import redis from '../../../common/redisConfig';
import sequelize from '../../../common/dbConfig';
import l from '../../../common/logger';
import { AdministratorModel, ApiResultModel } from '../../domain';
import { 
  AdministratorEntity,
  PlayingHistoryEntity,
  QuestionaireEntity,
  ReceiptEntity,
  UserEntity,
} from '../../entity';

const crypto = require('crypto');

/**
 * Controller of Admin Domain.
 */
class Controller {
  /**
   * 종목별 접속 정보 기능
   * @param {*} req
   * @param {*} res
   */
  async fetchConnectionRateBySubject(req, res) {
    try {
      const date = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      };

      const allConnectionBySubject = await sequelize.query(
        'SELECT count(DISTINCT(a.user_id)) AS userCount, q.topic_id, t.topicName FROM answers AS a INNER JOIN questionItems AS i ON i.id = a.item_id INNER JOIN questionaires AS q ON q.id = i.questionaire_id INNER JOIN topics AS t ON t.id = q.topic_id GROUP BY q.topic_id;',
      );

      const connectionBySubjectAndDate = await sequelize.query(
        `SELECT count(DISTINCT(a.user_id)) AS userCount, q.topic_id, t.topicName FROM answers AS a INNER JOIN questionItems AS i ON i.id = a.item_id INNER JOIN questionaires AS q ON q.id = i.questionaire_id INNER JOIN topics AS t ON t.id = q.topic_id WHERE DATE(a.created_at) BETWEEN '${date.startDate}' AND '${date.endDate}' GROUP BY q.topic_id;`,
      );

      const all = allConnectionBySubject[0].map(c => c);
      const byDate = connectionBySubjectAndDate[0].map(c => c);
      const result = [];

      all.forEach(o => {
        byDate.forEach(j => {
          if (o.topic_id === j.topic_id) {
            const connectionRate = (j.userCount / o.userCount) * 100;
            result.push({
              topicName: o.topicName,
              connectionRate: Math.ceil(connectionRate),
            });
          } else {
            result.push({
              topicName: o.topicName,
              connectionRate: '조회 기간 내에 문제를 푼 사용자가 존재하지 않음',
              err: 'USER_NOT_EXSISTS',
            });
          }
        });
      });

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: e }));
    }
  }
  async fetchUserInfoByCondition(req, res) {
    // 게임이력, 별구매 및 충전, QNA, 문제오류 신고
    const condition = req.body.condition;
    try {
      if (condition === 'PlayingHistories') {
        /**
         * 게임 이력 Request Body
         * userId
         * datetime (TODO)
         */
        const winPlayinghHistories = await PlayingHistoryEntity.findAll({
          where: {
            firstUserId: req.body.userId,
            result: 'win',
            created_at: {
              between: [
                new Date(req.body.startDate).toISOString(),
                new Date(req.body.endDate).toISOString(),
              ],
            },
          },
          include: {
            model: QuestionaireEntity,
            as: 'questionaire',
          },
        });

        const losePlayinghHistories = await PlayingHistoryEntity.findAll({
          where: {
            secondUserId: req.body.userId,
            result: 'lose',
            created_at: {
              between: [
                new Date(req.body.startDate).toISOString(),
                new Date(req.body.endDate).toISOString(),
              ],
            },
          },
          include: {
            model: QuestionaireEntity,
            as: 'questionaire',
          },
        });

        const result = {
          winPlayinghHistories,
          losePlayinghHistories,
        };

        res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
      } else if (condition === 'ReceiptHistory') {
        const targetReceiptEntity = await ReceiptEntity
          .findAll({
            where: {
              user_id: req.body.userId,
              created_at: {
                between: [
                  new Date(req.body.startDate).toISOString(),
                  new Date(req.body.endDate).toISOString(),
                ],
              },
            },
            include: [{
              model: UserEntity,
              as: 'user',
            }],
          });
        res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetReceiptEntity }));
      }
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
      l.error(e);
    }
  }

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
        const payload = {
          'id': crypto.randomBytes(16).toString("hex"),
          'userId': id,
          'message': req.body.message,
          "status": "UNREAD"
        }

        redis.lpush(`user-notification-${id}`, JSON.stringify(payload));
        await redis.expire(`user-notification-${id}`, 60 * 60 * 24 * 30); // 30일 동안 보관
      });
      res.status(200).send(result[0]);
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * @param {*} req
   * @param {*} res
   */
  async getMessages(req, res) {
    try {
      redis.lrange(`user-notification-${req.params.userId}`, 0, -1, (err, obj) => {
        const val = [];
        obj.forEach(v => val.push(JSON.parse(v)));
        res.status(200).send(new ApiResultModel({ statusCode: 200, message: val }));
      });
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 메시지를 보낸다.
   * @param {*} req
   * @param {*} res
   */
  async sendMessage(req, res) {
    try {
      req.body.userIds.forEach(async id => {
        l.info(req.body);

        // READ OR UNREAD
        const payload = {
          'id': crypto.randomBytes(16).toString("hex"),
          'userId': id,
          'message': req.body.message,
          "status": "UNREAD"
        }

        redis.lpush(`user-notification-${id}`, JSON.stringify(payload));
        await redis.expire(`user-notification-${id}`, 60 * 60 * 24 * 30); // 30일 동안 동안 보관
      });
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: "SUCCESS" }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * userId, NotificationId 받기.
   * @param {*} req
   * @param {*} res
   */
  async readMessage(req, res) {
    try {
      redis.lrange(`user-notification-${req.params.userId}`, 0, -1, (err, obj) => {
        obj.forEach(async v => {
          l.info(v)
          const data = JSON.parse(v);
          if (data.id === req.params.notificationId && data.status === "UNREAD") {
            await redis.lrem(`user-notification-${req.params.userId}`, 1, v);
            data.status = "READ"
            await redis.lpush(`user-notification-${req.params.userId}`, JSON.stringify(data));
          }
        });
      });
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: "SUCCESS" }));
    } catch (e) {
      l.info(e);
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
