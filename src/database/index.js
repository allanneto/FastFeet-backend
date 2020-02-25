import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Admin from '../app/models/AdminUser';
import Recipient from '../app/models/Recipient';
import Courier from '../app/models/Courier';
import File from '../app/models/File';
import Delivery from '../app/models/Delivery';
import Delivery_Problem from '../app/models/Delivery_Problem';

const models = [Recipient, Admin, Courier, File, Delivery, Delivery_Problem];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
