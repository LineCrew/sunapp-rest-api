import {
  StuffEntity,
  GivenStuffEntity,
  UserEntity,
} from '../../entity/';

import {
  StuffModel,
  ApiResultModel,
} from '../../domain';

import moment from '../../../common/seoulMoment';

import fs from 'fs';
import * as path from 'path';
import l from '../../../common/logger';

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
  async createStuff(req, res) {
    try {
      const destination = `${req.files.eventImage.fieldname}-${Date.now()}.${req.files.eventImage.extension}`;
      const stuffModel = new StuffModel({
        eventImage: destination,
        status: req.query.status,
        active: req.query.active,
        description: req.query.description,
      });

      fs.readFile(req.files.eventImage.path, async (err, data) => {
        fs.writeFile(path.join(`./public/uploads/${destination}`), data, async e => {
          if (err) res.status(500).send(new ApiResultModel({ statusCode: 500, e }));
          else {
            const generatedStuffEntity = await StuffEntity.create(stuffModel);
            res.status(200).send(new ApiResultModel({ statusCode: 200, message: generatedStuffEntity }));
          }
        });
      });
    } catch (e) {
      l.error(e);
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 이번주, 다음주 상품 목록을 불러옵니다.
   * @param {*} req
   * @param {*} res
   */
  async getStuffEntities(req, res) {
    try {
      const thisWeekStuffEntity = await StuffEntity.findOne({ where: { status: 1 } });
      const nextWeekStuffEntity = await StuffEntity.findOne({ where: { status: 2 } });

      res.status(200).send(new ApiResultModel({ statusCode: 200,
        message: {
          thisWeek: thisWeekStuffEntity,
          nextWeek: nextWeekStuffEntity,
        } }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 모든 상품 목록을 불러옵니다.
   * @param {*} req
   * @param {*} res
   */
  async getAllStuffEntities(req, res) {
    try {
      const targetStuffEntities = await StuffEntity.findAll();
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetStuffEntities }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 상품의 활성화 상태를 수정합니다.
   * @param {*} req
   * @param {*} res
   */
  async updateStuffStatus(req, res) {
    try {
      const updatedStuffEntity = await StuffEntity.update(
        { active: req.query.isActive },
        { where: { id: req.params.stuffId } },
      );

      if (updatedStuffEntity[0] === 1) res.status(200).send(new ApiResultModel({ statusCode: 200, message: 'SUCCESS' }));
      else res.status(200).send(new ApiResultModel({ statusCode: 200, message: 'FAIL' }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 상품 삭제
   * @param {*} req
   * @param {*} res
   */
  async deleteStuffEntity(req, res) {
    try {
      const result = await StuffEntity.destroy({ where: { id: req.params.stuffId } });
      res.status(200).send(new ApiResultModel({
        statusCode: 200,
        message: result,
      }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 200, message: e }));
    }
  }

  /**
   * 사용자에게 상품을 지급합니다.
   * @param {*} req
   * @param {*} res
   */
  async payStuffEntity(req, res) {
    try {
      const targetStuffEntity = await StuffEntity.findById(req.params.stuffId, {
        where: { active: 1 },
      });
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

      res.status(200).send(new ApiResultModel({ statuscode: 200, message: targetUserEntity }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }
}

export default new Controller();
