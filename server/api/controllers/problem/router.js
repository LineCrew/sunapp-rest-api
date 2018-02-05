import * as express from 'express';
import controller from './controller';
import multer from 'multer';
import UserValidator from '../../../common/userValidator';

const upload = multer({ dest: './public/uploads/' });

export default express
  .Router()
  .get('/', controller.getProblems)
  .post('/', upload.single('appImage'), controller.createProblem);
