import * as express from 'express';
import controller from './controller';
import UserValidator from '../../../common/userValidator';

export default express
  .Router()
  .get('/', controller.getAllUser)
  .get('/:userId', controller.getById)
  .get('/playRank', () => {})
  .get('/:userId/answers', controller.getUserAnsweredList)
  .get('/:userId/wrongAnswers', controller.getWrongAnswer)
  .put('/:userId', controller.updateUserInfo)
  .put('/:userId/star', controller.buyStar)
  .put('/refreshToken', controller.refreshAccessToken)
  .put('/:userId/heart', controller.doHeart)
  .post('/join', controller.post);
