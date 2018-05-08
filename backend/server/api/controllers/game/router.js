import * as express from 'express';
import controller from './controller';
import UserValidator from '../../../common/userValidator';

export default express
  .Router()
  .get('/', controller.getAllGameList)
  .get('/getRank', controller.getGameRank)
  .get('/:gameId', controller.getGameById)
  .post('/createGame', controller.post)
  .post('/game/setResult', controller.setGameResult);
