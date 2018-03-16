import * as express from 'express';
import controller from './controller';


export default express
  .Router()
  .get('/', controller.getStuffEntities)
  .get('/pay', controller.getPayedStuffEntities)
  .post('/', controller.createStuffEntity)
  .post('/pay', controller.payStuffEntity);
