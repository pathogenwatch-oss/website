const messageQueueConnection = require('utils/messageQueueConnection');

const QUEUE_OPTIONS = { durable: true, autoDelete: false };

messageQueueConnection.connect((error, mq) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  mq.queue('aggregator-errors-queue', QUEUE_OPTIONS, queue => {
    queue.subscribe({ ack: true }, _ => {
      mq.publish('aggregator-queue', _.message);
      queue.shift();
    });
  });
});
