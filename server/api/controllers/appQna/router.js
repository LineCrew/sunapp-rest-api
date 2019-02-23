import * as express from 'express';
import controller from './controller';
import multer from 'multer';

const upload = multer({ dest: './public/uploads/' });

export default express
  .Router()
  .get('/', controller.getProblems)
  .get('/:userId', controller.getProblemAnswer)
  .post('/', upload.single('appImage'), controller.createProblem);
