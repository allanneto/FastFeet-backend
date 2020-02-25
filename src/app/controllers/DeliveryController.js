import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';

import Queue from '../../lib/Queue';

import DeliveryMail from '../jobs/DeliveryMail';
import DeliveryCancelled from '../jobs/DeliveryCancelled';
import UpdateDeliveryMail from '../jobs/UpdateDeliveryMail';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      courier_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, courier_id, product } = req.body;

    // Recipient verification
    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      res.status(400).json({
        error: 'Recipient does not exists in database',
      });
    }

    const {
      recipient_name,
      postal_code,
      street,
      number,
      city,
      state,
    } = recipient;

    // Courier verification
    const courier = await Courier.findByPk(courier_id);

    if (!courier) {
      res.status(400).json({
        error: 'Courier does not exists in database',
      });
    }

    const { id } = await Delivery.create(req.body);

    const deliveryInfo = {
      delivery_id: id,
      recipient_name,
      street,
      number,
      postalCode: postal_code,
      city,
      state,
      product,
    };

    await Queue.add(DeliveryMail.key, {
      deliveryInfo,
      courier,
    });

    return res.json({
      message: 'Delivery registered',
      id,
      courier: {
        name: courier.name,
      },
      recipient: {
        name: recipient_name,
        cep: postal_code,
      },
      product,
    });
  }

  async index(req, res) {
    const page = 1;

    const deliveries = await Delivery.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!deliveries) {
      return res.status(400).json({ error: 'Database is empty' });
    }

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      courier_id: Yup.number(),
      signature_id: Yup.number(),
    });

    const {
      recipient_id: new_recipient,
      courier_id: new_courier,
      signature_id,
    } = req.body;

    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }

    const delivery = await Delivery.findByPk(req.params.id);

    const newRecipient = await Recipient.findByPk(new_recipient);
    const recipient = await Recipient.findByPk(delivery.recipient_id);

    const newCourier = await Courier.findByPk(new_courier);
    const courier = await Courier.findByPk(delivery.courier_id);

    if (new_courier !== undefined) {
      if (delivery.courier_id !== new_courier) {
        // New Courier verify

        const deliveryInfo = {
          delivery_id: delivery.id,
        };

        Queue.add(DeliveryMail.key, {
          deliveryInfo,
          courier: newCourier,
        });

        Queue.add(DeliveryCancelled.key, {
          deliveryInfo,
          courier,
        });

        delivery.update(req.body);

        return res.json({
          message: 'Delivery updated',
        });
      }
    }

    if (new_recipient !== undefined) {
      // Recipient Verify
      if (new_recipient !== delivery.recipient_id) {
        console.log(newRecipient);

        const {
          recipient_name,
          postal_code,
          street,
          number,
          city,
          state,
        } = newRecipient;

        const deliveryInfo = {
          delivery_id: delivery.id,
          recipient_name,
          street,
          number,
          postalCode: postal_code,
          city,
          state,
          product: delivery.product,
        };

        Queue.add(UpdateDeliveryMail.key, {
          deliveryInfo,
          courier,
        });

        delivery.update(req.body);

        return res.json({
          message: 'Delivery updated',
        });
      }
    }

    delivery.update(req.body);

    return res.json({ message: 'Signature updated' });
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    const courier = await Courier.findByPk(delivery.courier_id);

    const deliveryInfo = { delivery_id: req.params.id };

    delivery.destroy();

    Queue.add(DeliveryCancelled.key, {
      deliveryInfo,
      courier,
    });
    return res.json({
      message: 'Delivery deleted',
    });
  }

  async cancel(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    const courier = await Courier.findByPk(delivery.courier_id);

    const deliveryInfo = { delivery_id: req.params.id };

    delivery.canceled_at = new Date();

    await delivery.save();

    Queue.add(DeliveryCancelled.key, {
      deliveryInfo,
      courier,
    });

    return res.json({
      message: 'Recipient canceled',
    });
  }
}

export default new DeliveryController();
