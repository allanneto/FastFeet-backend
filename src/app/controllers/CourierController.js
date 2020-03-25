import * as Yup from 'yup';
import { Op } from 'sequelize';
import Courier from '../models/Courier';

class CourierController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name, email, avatar_id } = req.body;

    const verifyEmail = await Courier.findOne({ where: { email } });

    if (verifyEmail) {
      return res
        .status(400)
        .json({ error: 'The e-mail already registered in database' });
    }

    const { id } = await Courier.create(req.body);

    return res.json({
      event: 'Courier created',
      id,
      name,
      email,
      avatar_id,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const query = `%${req.query.courier}%`;

    if (query === '%undefined%') {
      const couriers = await Courier.findAll({
        order: ['id'],
        attributes: ['id', 'name', 'email', 'created_at'],
        limit: 20,
        offset: (page - 1) * 20,
      });

      if (couriers.length === 0) {
        return res.json({
          message: 'Does not exists couriers registered',
        });
      }

      return res.json(couriers);
    }

    const couriers = await Courier.findAll({
      where: { name: { [Op.iLike]: query } },
      order: ['id'],
      attributes: ['id', 'name', 'email', 'created_at'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (couriers.length === 0) {
      return res.json({
        message: 'Does not exists couriers with this name',
      });
    }

    return res.json(couriers);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name, email, id, avatar_id } = req.body;

    const courier = await Courier.findByPk(id);

    courier.update({
      name,
      email,
      avatar_id,
    });

    return res.json({
      message: 'Courier updated',
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const courier = await Courier.findByPk(req.params.id);

    if (!courier) {
      return res.status(400).json({ error: 'User not found in database' });
    }

    await courier.destroy();

    console.log(courier);

    return res.json({ message: 'User deleted!' });
  }
}

export default new CourierController();
