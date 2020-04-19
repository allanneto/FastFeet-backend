import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';
import Delivery_Problem from '../models/Delivery_Problem';

class DeliveryProblemsController {
  async index(req, res) {
    const { delivery } = req.query;

    if (delivery) {
      const problems = await Delivery_Problem.findAll({
        order: ['id'],
        where: { delivery_id: req.query.delivery },
      });

      return res.json(problems);
    }

    const problems = await Delivery_Problem.findAll({
      order: ['delivery_id'],
    });

    if (!problems) {
      return res.json({ message: 'This delivery does not have problems' });
    }

    return res.json(problems);
  }

  async store(req, res) {
    console.log(req.params);

    const { delivery_id } = req.params;
    const { description } = req.body;

    const schema = Yup.object().shape({
      description: Yup.string()
        .required()
        .max(255),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res
        .status(400)
        .json({ message: 'This delivery does not exists in database!' });
    }

    await Delivery_Problem.create({
      description,
      delivery_id,
    });

    return res.json({
      message: 'Problem registered',
      delivery_id,
      description,
    });
  }

  async delete(req, res) {
    const problem = await Delivery_Problem.findByPk(req.params.id);

    if (!problem) {
      return res
        .status(400)
        .json({ message: 'This problem does not exists in database' });
    }

    await problem.destroy();

    return res.json({
      message: `Problem ${req.params.id} deleted`,
    });
  }
}

export default new DeliveryProblemsController();
