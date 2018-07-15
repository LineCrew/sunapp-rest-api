import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/withdrawal', controller.getWithdrawalHistory)
  .get('/connection', controller.getUserConnectionHistory)
  .post('/account', controller.insertAdministrator)
  .post('/login', controller.loginAdministrator);
