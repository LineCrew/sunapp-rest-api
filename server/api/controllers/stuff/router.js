import * as express from 'express';
import controller from './controller';
import multer from 'multer';

const upload = multer({ dest: './public/uploads/' });

export default express
  .Router()
  .get('/', controller.getStuffEntities)
  .get('/all', controller.getAllStuffEntities)
  .get('/:userId/pay', controller.getPayedStuffEntities)
  .put('/:stuffId', controller.updateStuffStatus)
  .delete('/:stuffId', controller.deleteStuffEntity)
  .post('/', upload.single('eventImage'), controller.createStuff)
  .post('/:userId/:stuffId/pay', controller.payStuffEntity);
