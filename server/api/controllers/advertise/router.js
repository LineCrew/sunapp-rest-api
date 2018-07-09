import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/', controller.getAllAdvertiseList)
  .post('/', controller.createAdvertise);
