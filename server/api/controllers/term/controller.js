import { FaqEntity } from '../../entity/';
import { FaqModel, ApiResultModel } from '../../domain';
import TermEntity from '../../entity/TermEntity';

/**
 * Controller of User Domain.
 */
class Controller {
  /**
   * 약관 생성
   * @param {*} req
   * @param {*} res
   */
  async createTerm(req, res) {
    try {
      const termModel = { term: req.body.term };
      const result = await TermEntity.create(termModel);
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 약관 정보를 조회한다.
   * @param {*} req
   * @param {*} res
   */
  async getTerm(req, res) {
    try {
      const targetTermEntity = await TermEntity.findAll();
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetTermEntity }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 약관 정보를 삭제한다.
   * @param {*} req
   * @param {*} res
   */
  async deleteTerm(req, res) {
    try {
      await TermEntity.destroy({ where: { id: req.params.termId } });
      res.status(200).send(new ApiResultModel({ statusCode: 200 }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * FAQ 정보를 수정한다.
   * @param {*} req
   * @param {*} res
   */
  async updateTerm(req, res) {
    try {
      const termModel = { term: req.body.term };
      const result = await TermEntity.update(termModel, { where: { id: req.params.termId } });
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }
}

export default new Controller();
