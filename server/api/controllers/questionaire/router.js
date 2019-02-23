import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/', controller.getAllQuestionaireList)
  .get('/:questionaireId', controller.getQuestionItemsById)
  .put('/item/:questionItemId', controller.updateQuestionItemById)
  .put('/', controller.updateQuestionaireById)
  .post('/create', controller.createQuestionaire)
  .post('/items/limitTime', controller.updateQuestionItemsLimitTime)
  .post('/:questionaireId/addQuestionItem', controller.addQuestionItemToQuestionaire)
  .post('/:userId/:questionItemId/answers', controller.answer)
  .delete('/:questionaireId', controller.deleteQuestionaireById)
  .delete('/:questionaireId/all', controller.deleteQuestionItemsInQuestionare)
  .delete('/item/:questionItemId', controller.deleteQuestionaireById);
