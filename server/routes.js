import examplesRouter from './api/controllers/examples/router';
import userRouter from './api/controllers/user/router';
import gameRouter from './api/controllers/game/router';
import topicRouter from './api/controllers/topic/router';
import questionaireRouter from './api/controllers/questionaire/router';
import faqRouter from './api/controllers/faq/router';
import problemRouter from './api/controllers/problem/router';
import advertiseRouter from './api/controllers/advertise/router';

export default function routes(app) {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1/game', gameRouter);
  app.use('/api/v1/topic', topicRouter);
  app.use('/api/v1/questionaire', questionaireRouter);
  app.use('/api/v1/faq', faqRouter);
  app.use('/api/v1/problem', problemRouter);
  app.use('/api/v1/advertise', advertiseRouter);
}
