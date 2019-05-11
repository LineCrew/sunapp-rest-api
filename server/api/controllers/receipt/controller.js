import { ReceiptEntity, UserEntity } from '../../entity/';
import { ReceiptModel, ApiResultModel } from '../../domain/';

/**
 * Controller of Topic Domain.
 */
class Controller {
  /**
   * 영수증 생성 API
   * @param {*} req
   * @param {*} res
   */
  async post(req, res) {
    try {
      const receiptModel = new ReceiptModel(req.body);

      const targetUserEntity = await UserEntity.findById(req.params.userId);
      const generatedReceiptEntity = await ReceiptEntity.create(receiptModel);
      await targetUserEntity.addReceipts(generatedReceiptEntity);
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: generatedReceiptEntity }));
    } catch (e) {
      console.log(e);
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 영수증 목록 가져오기
   * @param {*} req
   * @param {*} res
   */
  async get(req, res) {
    try {
      const targetReceiptEntity = await ReceiptEntity
        .findAll({
          include: [{
            model: UserEntity,
            as: 'user',
          }],
        });

        res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetReceiptEntity }));
    } catch (e) {
      console.log(e);
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e })); 
    }

  }
}

export default new Controller();
