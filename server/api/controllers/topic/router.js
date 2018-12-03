import * as express from 'express';
import controller from './controller';
import UserValidator from '../../../common/userValidator';

export default express
  .Router()
  .get('/', controller.getAllTopicList)
  .get('/:topicId', controller.getById)
  .post('/createTopic', controller.post);
