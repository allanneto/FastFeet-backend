import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Admin from '../app/models/AdminUser';
import Recipient from '../app/models/Recipient';

const models = [Recipient, Admin];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
