import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { deliveryInfo, courier } = data;

    const {
      delivery_id,
      recipient_name,
      street,
      number,
      postalCode,
      city,
      state,
      product,
    } = deliveryInfo;

    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: `Nova entrega disponivel - ID: ${delivery_id}`,
      template: 'delivery',
      context: {
        courier: courier.name,
        name: recipient_name,
        street,
        number,
        postalCode,
        city,
        state,
        product,
      },
    });
  }
}

export default new DeliveryMail();
