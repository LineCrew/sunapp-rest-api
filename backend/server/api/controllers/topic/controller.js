import { GameEntity, TopicEntity, QuestionaireEntity } from '../../entity/';
import { TopicModel, ApiResultModel } from '../../domain/';
import DBService from '../../services/DbService';

/**
 * Controller of Topic Domain.
 */
class Controller {
  async getAllTopicList(req, res) {
    try {
      const targetTopicEntities = await TopicEntity.findAll({
        include: [{
          model: QuestionaireEntity,
          as: 'questionaires',
        }],
      });

      res.send(200, new ApiResultModel({ statusCode: 200, message: targetTopicEntities }));
    } catch (e) {
      res.send(500, new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  async post(req, res) {
    const topicModel = new TopicModel(req.body);

    try {
      const targetGameEntity = await new DBService(GameEntity)
        .findById(topicModel.gameId);

      const generatedTopicEntity = await new DBService(TopicEntity)
        .create(topicModel);

      const result = await targetGameEntity.addTopics(generatedTopicEntity);

      res.send(200, new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.send(500, new ApiResultModel({ statusCode: 500, message: e }));
    }
  }
}

export default new Controller();
