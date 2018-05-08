import './common/env';
import Server from './common/server';
import routes from './routes';

const apiRestServer = new Server();
apiRestServer.syncSchema()
  .then(() => apiRestServer.router(routes))
  .then(() => apiRestServer.listen());

export default apiRestServer;
