import * as express from 'express';
import controller from './controller';
import UserValidator from '../../../common/userValidator';

export default express
  .Router()
  .post('/:userId', controller.post)
  .get('/', controller.get);
