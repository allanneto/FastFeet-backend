import Mail from '../../lib/Mail';

class DeliveryCancelled {
  get key() {
    return 'DeliveryCancelled';
  }

  async handle({ data }) {
    const { deliveryInfo, courier } = data;

    const { delivery_id } = deliveryInfo;

    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: `Entrega Cancelada - ID: ${delivery_id}`,
      template: 'cancellation',
      context: {
        courier: courier.name,
        id: delivery_id,
      },
    });
  }
}

export default new DeliveryCancelled();
