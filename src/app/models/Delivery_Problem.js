import Sequelize, { Model } from 'sequelize';

class Delivery_Problem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        delivery_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'delivery_problems',
      }
    );
    return this;
  }
}
export default Delivery_Problem;
