import Mail from '../../lib/Mail';

class UpdateDeliveryMail {
  get key() {
    return 'UpdateDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryInfo, courier } = data;

    const { delivery_id } = deliveryInfo;

    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: `Atualização em entrega - ID: ${delivery_id}`,
      template: 'updatedelivery',
      context: {
        courier: courier.name,
        id: delivery_id,
      },
    });
  }
}
export default new UpdateDeliveryMail();
