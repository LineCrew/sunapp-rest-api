import * as express from 'express';
import controller from './controller';


export default express
  .Router()
  .get('/', controller.getStuffEntities)
  .get('/:userId/pay', controller.getPayedStuffEntities)
  .post('/', controller.createStuffEntity)
  .post('/:userId/:stuffId/pay', controller.payStuffEntity);
