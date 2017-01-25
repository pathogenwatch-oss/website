const messageQueueConnection = require('utils/messageQueueConnection');

const QUEUE_OPTIONS = { durable: true, autoDelete: false };

messageQueueConnection.connect().
  then(mq =>
    mq.queue('aggregator-errors-queue', QUEUE_OPTIONS, queue => {
      queue.subscribe({ ack: true }, _ => {
        mq.publish('aggregator-queue', _.message);
        queue.shift();
      });
    })
  ).
  then(() => process.exit(0)).
  catch(error => {
    console.error(error);
    process.exit(1);
  });
