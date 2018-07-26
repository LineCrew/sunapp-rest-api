import { FaqEntity } from '../../entity/';
import { FaqModel, ApiResultModel } from '../../domain';

/**
 * Controller of User Domain.
 */
class Controller {
  /**
   * FAQ 정보를 생성한다.
   * @param {*} req
   * @param {*} res
   */
  async createFaq(req, res) {
    try {
      const faqModel = new FaqModel(req.body);
      const result = await FaqEntity.create(faqModel);
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * FAQ 정보를 조회한다.
   * @param {*} req
   * @param {*} res
   */
  async getFaq(req, res) {
    try {
      const targetFaqEntity = await FaqEntity.findAll({ order: [['topic', 'DESC']] });
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetFaqEntity }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * FAQ 정보를 삭제한다.
   * @param {*} req
   * @param {*} res
   */
  async deleteFaq(req, res) {
    try {
      await FaqEntity.destroy({ where: { id: req.params.faqId } });
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
  async updateFaq(req, res) {
    try {
      const faqModel = new FaqModel(req.body);
      const result = await FaqEntity.update(faqModel, { where: { id: req.params.faqId } });
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

}

export default new Controller();
