import Bee from 'bee-queue';
import redisConfig from '../config/redis';
import DeliveryMail from '../app/jobs/DeliveryMail';
import UpdateDeliveryMail from '../app/jobs/UpdateDeliveryMail';
import DeliveryCancelled from '../app/jobs/DeliveryCancelled';

const jobs = [DeliveryMail, UpdateDeliveryMail, DeliveryCancelled];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    this.queues[queue].bee.createJob(job).save();
  }

  proccessQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: Failed`, err);
  }
}

export default new Queue();
