import * as express from 'express';
import controller from './controller';
import UserValidator from '../../../common/userValidator';

export default express
  .Router()
  .get('/', controller.getAllGameList)
  .get('/getRank', controller.getGameRank)
  .get('/:userId/history', controller.getUserPlayingHistory)
  .get('/:gameId', controller.getGameById)
  .get('/:userId/playingHistory', controller.getPlayingHistory)
  .post('/createGame', controller.post)
  .post('/game/setResult', controller.setGameResult)
  .post('/playingHistory', controller.setPlayingHistory);
