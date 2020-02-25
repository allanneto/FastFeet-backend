import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        recipient_id: Sequelize.INTEGER,
        courier_id: Sequelize.INTEGER,
        signature_id: Sequelize.INTEGER,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
        modelName: 'delivery',
      }
    );
    return this;
  }
}

export default Delivery;
