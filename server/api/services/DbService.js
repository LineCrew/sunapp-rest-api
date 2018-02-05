import { Model } from 'sequelize';

/**
 * 각각의 Entity 를 DatabaseService 로 주입시켜 타입을 체크하고, 기본적인 Method 를 제공한다.
 */
export default class DatabaseService {
  constructor(model) {
    if (Object.getPrototypeOf(model) !== Model) throw new Error('Invalid Entity');
    else this.model = model;
  }

  async findById(id, options = {}) {
    const result = await this.model.findById(id, options);
    return result;
  }

  async find(options) {
    const result = await this.model.find(options);
    return result;
  }

  async create(model = {}, options = {}) {
    const result = await this.model.create(model, options);
    return result;
  }

  async findAll(options = {}) {
    const result = await this.model.findAll(options);
    return result;
  }
}
