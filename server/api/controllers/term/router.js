import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/', controller.createTerm)
  .get('/', controller.getTerm)
  .delete('/:termId', controller.deleteTerm)
  .put('/:termId', controller.updateTerm);
