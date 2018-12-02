import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/', controller.getAllAdvertiseList) //
  .get('/:advertiseId/watch', controller.getWatchedUserAdvertise)
  .put('/:advertiseId', controller.updateAdvertiseById) //
  .delete('/:advertiseId', controller.deleteAdvertiseById) //
  .post('/', controller.createAdvertise) //
  .post('/:advertiseId/:userId/watch', controller.watchAdvertiseByUser);
