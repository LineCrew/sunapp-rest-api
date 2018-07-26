import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/', controller.createFaq)
  .get('/', controller.getFaq)
  .put('/:faqId', controller.updateFaq)
  .delete('/:faqId', controller.deleteFaq);
