import Express from 'express';
import Sequelize from './dbConfig';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import {
  ProblemEntity,
  FaqEntity,
  UserEntity,
  GameResultEntity,
  GameEntity,
  TopicEntity,
  QuestionaireEntity,
  QuestionItemEntity,
  UserAnswerEntity,
  AdvertiseEntity,
  AdvertiseHistoryEntity,
  UserQuestionEntity,
  ReceiptEntity,
} from '../api/entity/';
import * as http from 'http';
import * as os from 'os';
import cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';
import morgan from 'morgan';
import cors from 'cors';
import ErrorHandler from './errorHandler';
import morganBody from 'morgan-body';

const app = new Express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json());
    app.use(cors());
    app.use(ErrorHandler);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use('/', Express.static(path.join('./public')));
    morganBody(app);
  }

  async syncSchema() {
    if (process.env.SERVICE_LEVEL === 'develop') {
      await UserEntity.sync();
      await GameEntity.sync();
      await TopicEntity.sync();
      await QuestionaireEntity.sync();
      await QuestionItemEntity.sync();
      await UserAnswerEntity.sync();
      await GameResultEntity.sync();
      await FaqEntity.sync();
      await ProblemEntity.sync();
      await AdvertiseEntity.sync();
      await AdvertiseHistoryEntity.sync();
      await UserQuestionEntity.sync();
      await ReceiptEntity.sync();

      l.info('database syncing done.');
    }

    return this;
  }

  async router(routes) {
    await swaggerify(app, routes);
    return this;
  }

  async listen(port = process.env.PORT) {
    const welcome = p => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${p}}`);
    await http.createServer(app).listen(port, welcome(port));
    return app;
  }
}
