import * as express from 'express';
import controller from './controller';


export default express
  .Router()
  .post('/sendToAllDevice', controller.sendToAllDevice)
  .post('/:userId/sendToDevice', controller.sendToDevice);