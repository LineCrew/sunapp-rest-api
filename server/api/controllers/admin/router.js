import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/withdrawal', controller.getWithdrawalHistory)
  .get('/connection', controller.getUserConnectionHistory)
  .get('/:userId/messages', controller.getMessages)
  .post('/account', controller.insertAdministrator)
  .post('/login', controller.loginAdministrator)
  .post('/sendStar', controller.sendStarWithMessage)
  .post('/sendMessage', controller.sendMessage)
  .post('/:userId/:notificationId/readMessage', controller.readMessage)
  .post('/sendProblemAnswer', controller.sendProblemAnswer)
  .post('/userInfo', controller.fetchUserInfoByCondition)
  .post('/connectionRate', controller.fetchConnectionRateBySubject);
