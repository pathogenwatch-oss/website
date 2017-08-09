const messageQueueConnection = require('utils/messageQueueConnection');
const mongoConnection = require('utils/mongoConnection');

const Collection = require('models/collection');

const QUEUE_OPTIONS = { durable: true, autoDelete: false };

Promise.all([
  messageQueueConnection.connect(),
  mongoConnection.connect(),
])
.then(([ mq ]) =>
    mq.queue('aggregator-errors-queue', QUEUE_OPTIONS, queue => {
      queue.subscribe({ ack: true }, _ => {
        const { collectionId } = _.message;
        Collection.findByUuid(collectionId)
          .then(collection => {
            if (collection.status !== 'READY') {
              mq.publish('aggregator-queue', _.message);
            } else {
              console.warn('Ignoring message for ready collection', _.message);
            }
            queue.shift();
          });
      });
    })
  ).
  then(() => console.log('Press Ctrl/Cmd + C to quit.')).
  catch(error => {
    console.error(error);
    process.exit(1);
  });
