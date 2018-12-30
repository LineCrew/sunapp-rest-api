import * as express from 'express';
import controller from './controller';
import UserValidator from '../../../common/userValidator';

export default express
  .Router()
  .get('/', controller.getAllUser)
  .post('/login', controller.login)
  .get('/getPlayers', controller.getPlayers)
  .get('/question', controller.getUserQuestionEntity)
  .get('/:userId', controller.getById)
  .post('/withdrawal/history', controller.userWithDrawalHistory)
  .get('/:userId/answers', controller.getUserAnsweredList)
  .get('/:userId/notifications', controller.getNotificationMessages)
  .get('/:userId/wrongAnswers', controller.getWrongAnswer)
  .get('/:userId/friends', controller.getFriends)
  .put('/:userId', controller.updateUserInfo)
  .put('/:userId/star', controller.buyStar)
  .put('/refreshToken', controller.refreshAccessToken)
  .put('/:userId/heart', controller.doHeart)
  .post('/join', controller.post)
  .post('/:userId', controller.updateConnectHistory)
  .post('/question', controller.createUserQuestionEntity)
  .post('/:userId/syncFacebookFriends', controller.syncFacebookFriends)
  .post('/email/check', controller.checkIdExists)
  .post('/nickname/check', controller.checkNickNameExists)
  .delete('/:userId/withdrawal', controller.userWithdrawal);