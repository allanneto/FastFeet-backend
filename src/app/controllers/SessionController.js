import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

import authConfig from '../../config/auth';

import AdminUser from '../models/AdminUser';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ message: 'The email or password is incorrect' });
    }

    const { email, password } = req.body;
    try {
      const admin = await AdminUser.findOne({ where: { email } });

      if (!admin) {
        return res
          .status(400)
          .json({ message: `This admin user doesn't exists` });
      }

      if (!(await admin.checkPassword(password))) {
        return res.status(400).json({ error: 'Wrong Password' });
      }

      const { name, id } = admin;

      return res.json({
        access: {
          name,
          email,
          token: jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
          }),
        },
      });
    } catch (err) {
      return res.status(400).json({ message: 'Error' });
    }
  }
}

export default new SessionController();
