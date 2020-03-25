import {
  startOfToday,
  endOfToday,
  isAfter,
  isBefore,
  parseISO,
  endOfHour,
  startOfHour,
  getHours,
  setSeconds,
  setHours,
  setMinutes,
} from 'date-fns';

import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';
import File from '../models/File';

class CourierOptionsContoller {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: {
        courier_id: req.params.courier_id,
        canceled_at: null,
        end_date: null,
      },
    });

    return res.json(deliveries);
  }

  async startDelivery(req, res) {
    const { courier_id, delivery_id } = req.params;

    const delivery = await Delivery.findByPk(delivery_id);

    if (delivery.start_date !== null) {
      return res.status(400).json({
        message: 'This delivery has already started.',
      });
    }

    // eslint-disable-next-line radix
    if (delivery.courier_id !== parseInt(courier_id)) {
      return res.status(400).json({
        message:
          'You cannot register this delivery the courier Id does not match',
      });
    }

    const day_deliveries = await Delivery.findAll({
      where: {
        courier_id,
        start_date: {
          [Op.between]: [startOfToday(), endOfToday()],
        },
      },
    });

    const deliveries_array = Object.keys(day_deliveries);

    if (deliveries_array.length === 5) {
      return res.status(400).json({
        message: 'You cannot get more than 5 deliveries per day',
      });
    }

    // Time check
    if (
      !isAfter(new Date(), setMinutes(setHours(new Date(), 4), 59)) ||
      !isBefore(new Date(), setMinutes(setHours(new Date(), 15), 0))
    ) {
      return res.status(400).json({
        message: ' You can just start a delivery between 08am and 06pm',
      });
    }

    if (delivery.canceled_at) {
      return res.status(400).json({
        message: 'This delivery is already cancelled',
      });
    }

    delivery.update({
      start_date: new Date(),
    });

    return res.json({ message: 'Start date registred on delivery' });
  }

  async finishDelivery(req, res) {
    const { courier_id, delivery_id } = req.params;

    const delivery = await Delivery.findByPk(delivery_id);

    // Check start
    if (delivery.start_date === null) {
      return res.status(400).json({
        message: 'This delivery is not started',
      });
    }

    // eslint-disable-next-line radix
    if (delivery.courier_id !== parseInt(courier_id)) {
      return res.status(400).json({
        message:
          'You cannot register this delivery the courier Id does not match',
      });
    }
    const { originalname: name, filename: path } = req.file;

    const { id } = await File.create({
      name,
      path,
    });

    // const hourStart = isBefore(new Date());

    delivery.update({
      signature_id: id,
      end_date: new Date(),
    });

    return res.json({
      message: 'Delivery has been completed',
      signaturePath: path,
    });
  }
}

export default new CourierOptionsContoller();
