import { AdvertiseEntity, AdvertiseHistoryEntity } from '../../entity';
import { AdvertiseModel, ApiResultModel } from '../../domain/advertiseModel';
import sequelize from '../../../common/dbConfig';

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
  * 광고 시청한 유저를 조회한다.
  * @param {*} req
  * @param {*} res
  */
//   async getUserByAdvertiseId(req, res) {
//     const advertiseId = req.params.advertiseId;

//     try {
//       const result =
//     } catch(e) {

//     }
//   }

  /**
  * 광고를 시청한다.
  * @param {*} req
  * @param {*} res
  */
}

export default new Controller();
