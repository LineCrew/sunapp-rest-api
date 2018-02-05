import l from '../../common/logger';
import db from './examples.db.service';

class ExamplesService {
  all() {
    return 'Hello World';
  }

  byId(id) {
    l.info(`${this.constructor.name}.byId(${id})`);
    return db.byId(id);
  }

  create(name) {
    return db.insert(name);
  }
}

export default new ExamplesService();
