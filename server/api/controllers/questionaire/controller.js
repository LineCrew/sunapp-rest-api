import { TopicEntity, QuestionaireEntity, QuestionItemEntity, UserAnswerEntity, UserEntity } from '../../entity/';
import { ApiResultModel, QuestionaireModel, QuestionItemModel, AnswerModel } from '../../domain/';
import shuffle from 'shuffle-array';
import sequelize from '../../../common/dbConfig';
import l from '../../../common/logger';

/**
 * Controller of Questionaire Domain.
 */
class Controller {
  /**
   * 문제지에 따른 모든 문제 내역을 조회한다.
   * @param {*} req 
   * @param {*} res 
   */
  async getQuestionItemsById(req, res) {
    try {
      const targetQuestionaireEntity = await QuestionaireEntity
        .findById(req.params.questionaireId, {
          include: [{
            model: QuestionItemEntity,
            as: 'items',
            order: [sequelize.fn('RAND')],
            limit: req.query.limit,
          }],
        });

      res.status(200).send(
        new ApiResultModel({ statusCode: 200, message: targetQuestionaireEntity }),
      );
    } catch (e) {
      res.send(500, new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * ex : /Questionaire/{userId}/{questionItemId}/answers
   * 사용자가 문제에 대한 응답하고, 정답인지 오답인지 조회하는 메서드
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async answer(req, res) {
    try {
      const answerModel = new AnswerModel(req.body);

      const targetUserEntity = await UserEntity.findById(req.params.userId);
      const targetQuestionItemEntity = await QuestionItemEntity
        .findById(req.params.questionItemId);

      if (targetQuestionItemEntity.answer === answerModel.answer) {
        answerModel.isCorrect = true;
      } else if (targetQuestionItemEntity.answer !== answerModel.answer) {
        answerModel.isCorrect = false;
      }

      const generatedUserAnswerEntity = await UserAnswerEntity.create(answerModel);

      // AnswerEntity 와 각 Entitiy 와의 관계를 맺음.
      await Promise.all([
        generatedUserAnswerEntity.setItem(targetQuestionItemEntity),
	generatedUserAnswerEntity.setUser(targetUserEntity),
        targetUserEntity.addUserAnswers(generatedUserAnswerEntity),
      ]);

      res.send(200, new ApiResultModel({ statusCode: 200, message: answerModel }));
    } catch (e) {
      console.log(e);
      res.send(500, new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * QuestionaireId 에 속하는 문제지에 QuestionItem 을 추가하는 메서드
   * @param {*} req
   * @param {*} res
   */
  async addQuestionItemToQuestionaire(req, res) {
    try {
      const questionItemModel = new QuestionItemModel(req.body);

      const contentLength = questionItemModel.content.length;

      if (contentLength < 200) questionItemModel.limitTime = 10;
      else if (contentLength > 200 && contentLength < 400) questionItemModel.limitTime = 20;
      else if (contentLength > 400 && contentLength < 600) questionItemModel.limitTime = 30;
      else if (contentLength > 600 && contentLength < 800) questionItemModel.limitTime = 40;
      else if (contentLength > 800) questionItemModel.limitTime = 50;

      const targetQuestionaireEntity = await QuestionaireEntity.findById(req.params.questionaireId);
      const generatedQuestionItemEntity = await QuestionItemEntity.create(questionItemModel);
      const result = await targetQuestionaireEntity.addItems(generatedQuestionItemEntity);

      res.send(200, new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.send(500, new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 모든 Questionaire 를 조회하는 메서드
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAllQuestionaireList(req, res) {
    try {
      const targetQuestionaireEntity = await QuestionaireEntity
        .findAll({
          include: [{
            model: QuestionItemEntity,
            as: 'items',
          }],
        });

      res.status(200).send(
        new ApiResultModel({ statusCode: 200, message: targetQuestionaireEntity }),
      );
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * Questionaire 를 생성하는 메서드
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async createQuestionaire(req, res) {
    try {
      const questionaireModel = new QuestionaireModel(req.body);

      const targetTopicEntity = await TopicEntity
        .findById(questionaireModel.topicId);

      const generatedQuestionaireEntity = await QuestionaireEntity
        .create(questionaireModel);

      const result = await targetTopicEntity.addQuestionaires(generatedQuestionaireEntity);
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }
}

export default new Controller();
