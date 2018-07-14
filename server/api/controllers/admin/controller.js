import redis from '../../../common/redisConfig';
import sequelize from '../../../common/dbConfig';
import l from '../../../common/logger';
import ApiResultModel from '../../domain/apiResultModel';

/**
 * Controller of Admin Domain.
 */
class Controller {
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
