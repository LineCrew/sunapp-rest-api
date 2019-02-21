import { UserEntity, AdvertiseEntity, AdvertiseHistoryEntity } from '../../entity';
import { AdvertiseModel, ApiResultModel } from '../../domain';
import redis from '../../../common/redisConfig';

/**
 * Controller of Advertise
 */
class Controller {
  /**
  * 광고를 생성한다.
  * @param {*} req
  * @param {*} res
  */
  async createAdvertise(req, res) {
    try {
      const advertiseModel = new AdvertiseModel(req.body);
      const result = await AdvertiseEntity.create(advertiseModel);
      res.send(200, new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.send(500, new ApiResultModel({ statusCode: 500, message: e }));
    }
  }
  
  /**
  * 모든 광고를 조회한다.
  * @param {*} req
  * @param {*} res
  */
  async getAllAdvertiseList(req, res) {
    try {
      const result = await AdvertiseEntity
        .findAll();

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
  * 광고를 편집한다.
  * @param {*} req
  * @param {*} res
  */
  async updateAdvertiseById(req, res) {
    try {
      const advertiseModel = new AdvertiseModel(req.body);
      
      const result = await AdvertiseEntity.update(
        advertiseModel, { where: { id: req.params.advertiseId } },
      )

      return res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      return res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
  * 광고를 삭제한다.
  * @param {*} req
  * @param {*} res
  */
  async deleteAdvertiseById(req, res) {
    try {
      const advertiseModel = new AdvertiseModel(req.body);
      
      const result = await AdvertiseEntity.update(
        advertiseModel, { where: { id: req.params.advertiseId } },
      )

      return res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      return res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 사용자의 광고 시청 API
   * @param {*} req 
   * @param {*} res 
   */
  async watchAdvertiseByUser(req, res) {
    try {
      const advertiseId = req.params.advertiseId;
      const userId = req.params.userId;

      const targetUserEntity = await UserEntity.findById(userId);
      targetUserEntity.star = req.body.star;
      await targetUserEntity.save();
      redis.lpush(`advertise-${advertiseId}`, targetUserEntity.toString());

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: 'success' }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 광고를 시청한 사용자의 목록을 불러옴.
   * @param {*} req 
   * @param {*} res 
   */
  async getWatchedUserAdvertise(req, res) {
    try {
      const result = await redis.lrange(`advertise-${req.params.advertiseId}`, 0, -1);
      const users = [];

      result.forEach(item => {
        users.push(JSON.parse(item));
      });

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));

    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: e }));
    }
  }
}

export default new Controller();
