import {
  StuffEntity,
  GivenStuffEntity,
  UserEntity,
} from '../../entity/';

import {
  StuffModel,
  ApiResultModel,
} from '../../domain';


/**
 * 상품 도메인에 관한 모든 API 가 여기에 있습니다.
 * 상품 추가, 상품 지급 (자동 지급이 아닌 관리자의 수작업을 통한 지급), 상품 지급 히스토리 기록, 상품 정보 가져오기
 */
class Controller {

  /**
   * 사용자에게 지급하고자하는 상품을 생성합니다.
   * @param {*} req
   * @param {*} res 
   */
  async createStuffEntity(req, res) {
    try {
      const stuffModel = new StuffModel(req.body);
      const generatedStuffEntity = await StuffEntity.create(stuffModel);

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: generatedStuffEntity }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 상품 목록을 불러옵니다.
   * @param {*} req
   * @param {*} res 
   */
  async getStuffEntities(req, res) {
    try {
      const isActive = req.query.isActive;
      const targetStuffEntities = await StuffEntity.findAll({
        where: { isActive },
      });
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetStuffEntities }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));      
    }
  }

  /**
   * 사용자에게 상품을 지급합니다.
   * @param {*} req
   * @param {*} res
   */
  async payStuffEntity(req, res) {
    try {
      const targetStuffEntity = await StuffEntity.findById(req.params.stuffId);
      const targetUserEntity = await UserEntity.findById(req.params.userId);
      const generatedGivenStuffEntity = await GivenStuffEntity.create();

      await generatedGivenStuffEntity.setStuff(targetStuffEntity);
      await targetUserEntity.addGivenStuffs(generatedGivenStuffEntity);

      res.status(200).send(new ApiResultModel({
        statusCode: 200,
        message: {
          targetStuffEntity,
          targetUserEntity,
          generatedGivenStuffEntity,
        },
      }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 200, message: e }));
    }
  }

  /**
   * 사용자에게 지급된 상품 목록을 조회합니다.
   * @param {*} req
   * @param {*} res
   */
  async getPayedStuffEntities(req, res) {
    try {
      const targetUserEntity = await UserEntity.findById(req.params.userId, {
        include: {
          model: GivenStuffEntity,
          as: 'givenStuffs',
          include: [{
            model: StuffEntity,
            as: 'stuff',
          }],
        },
      });

      console.log(targetUserEntity);
    } catch (e) {
      console.log(e);
      
    }
      
  }

}

export default new Controller();
