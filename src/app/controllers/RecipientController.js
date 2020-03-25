import * as Yup from 'yup';
import { Op } from 'sequelize';
import axios from 'axios';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      postalCode: Yup.string()
        .required()
        .min(8)
        .max(8),
      number: Yup.string().required(),
      complement: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      const { postalCode } = req.body;

      if (postalCode === undefined || postalCode.length !== 8) {
        return res.status(400).json({
          error:
            'The Postal Code must be contais 8 characters and only accept number characters',
        });
      }

      return res.status(400).json({
        error: 'Validation Fail',
      });
    }

    const { postalCode, name, number, complement, street } = req.body;

    try {
      const response = await axios.get(
        `http://viacep.com.br/ws/${postalCode}/json/`
      );
      const { data } = response;

      if (!data.logradouro) {
        if (!street) {
          return res.status(400).json({
            error:
              'The postal code informed does not contains the street please insert manually',
          });
        }
        data.logradouro = street;
      }

      const recipient = {
        recipient_name: name,
        street: data.logradouro,
        number,
        complement,
        state: data.uf,
        city: data.localidade,
        postal_code: postalCode,
      };

      const { id: recipient_id } = await Recipient.create({
        recipient_name: name,
        street: data.logradouro,
        number,
        complement,
        state: data.uf,
        city: data.localidade,
        postal_code: postalCode,
      });

      return res.json({
        message: 'Recipient created',
        recipient_info: {
          recipient,
          recipient_id,
        },
      });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'The postal code inserted does not exists' });
    }
  }

  async update(req, res) {
    const { name, postalCode, number, complement, street } = req.body;

    if (postalCode && postalCode.length !== 8) {
      return res.status(400).json({
        error:
          'The postal code must be contais 8 characters and only accept number characters',
      });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (postalCode !== undefined && postalCode !== recipient.postal_code) {
      try {
        const response = await axios.get(
          `http://viacep.com.br/ws/${postalCode}/json/`
        );

        const { data } = response;

        if (!data.logradouro) {
          if (!street) {
            return res.status(400).json({
              error:
                'The postal code informed does not contains the street please insert manually',
            });
          }
          data.logradouro = street;
        }

        const { id: recipient_id } = recipient.update({
          recipient_name: name,
          street: data.logradouro,
          number,
          complement,
          state: data.uf,
          city: data.localidade,
          postal_code: postalCode,
        });

        return res.json({
          message: 'Updated',
          recipient_info: {
            recipient,
            recipient_id,
          },
        });
      } catch (err) {
        return res
          .status(400)
          .json({ error: 'The postal code inserted does not exists' });
      }
    }

    const newRecipient = {
      recipient_name: name,
      number,
      complement,
    };

    const { id: recipient_id } = recipient.update(newRecipient);

    return res.json({
      message: 'Updated',
      recipient_info: {
        recipient,
        recipient_id,
      },
    });
  }

  async index(req, res) {
    const { page = 1 } = req.params;

    const query = `%${req.query.name}%`;

    if (query === '%undefined%') {
      const recipients = await Recipient.findAll({
        order: ['id'],
        attributes: ['id', 'recipient_name', 'postal_code'],
        limit: 20,
        offset: (page - 1) * 20,
      });

      if (recipients.length === 0) {
        return res.json({
          message: 'Does not exists recipients registered',
        });
      }

      return res.json(recipients);
    }
    const recipients = await Recipient.findAll({
      where: { recipient_name: { [Op.iLike]: query } },
      order: ['id'],
      attributes: ['id', 'recipient_name', 'postal_code'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (recipients.length === 0) {
      return res.json({
        message: 'Does not exists recipients with this name',
      });
    }

    return res.json(recipients);
  }
}

export default new RecipientController();
