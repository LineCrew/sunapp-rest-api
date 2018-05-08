import * as express from 'express';
import controller from './controller';
import UserValidator from '../../../common/userValidator';

export default express
  .Router()
  .get('/', controller.getAllQuestionaireList)
  .get('/:questionaireId', controller.getQuestionItemsById)
  .post('/create', controller.createQuestionaire)
  .post('/:questionaireId/addQuestionItem', controller.addQuestionItemToQuestionaire)
  .post('/:userId/:questionItemId/answers', controller.answer);
