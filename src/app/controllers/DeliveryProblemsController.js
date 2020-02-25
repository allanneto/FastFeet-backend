import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';
import Delivery_Problem from '../models/Delivery_Problem';

class DeliveryProblemsController {
  async index(req, res) {
    console.log(req.params.delivery_id, 'OK');

    const { delivery_id } = req.params;

    const problems = await Delivery_Problem.findAll({
      where: { delivery_id: req.params.delivery_id },
    });

    console.log('passei');

    if (!problems) {
      return res.json({ message: 'This delivery does not have problems' });
    }

    return res.json(problems);
  }

  async store(req, res) {
    const { delivery_id } = req.params;
    const { description } = req.body;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' });
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
}

export default new DeliveryProblemsController();
