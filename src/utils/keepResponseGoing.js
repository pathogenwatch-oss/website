// This is used to stop the load balancer
// from killing connections after 60 seconds.

// The Digitalocean load balancer cancels connections if no content
// is received for 60 seconds.  This wraps a response object
// and buffers any data written so that it can be "dripped"
// through the load balancer and maintain the connection.

// This only works if some data is immediatly available
// (e.g. a header row) and if the total response is small
// enough to be held in memory.

const TIMEOUT = 15 * 60 * 1000;
const createError = require('http-errors');

const timeoutError = createError(503, 'Response timeout', {
  code: 'ETIMEDOUT',
  timeout: TIMEOUT,
});

module.exports = function (req, res, next) {
  res.timedOut = false;
  let interval = null;
  let timeout = setTimeout(() => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    res.timedOut = true;
    next(timeoutError);
  }, TIMEOUT);

  let buffer = '';
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);

  const sendBit = () => {
    if (buffer.length === 0) return;
    originalWrite(buffer.slice(0, 1));
    buffer = buffer.slice(1);
  };

  res.write = (content = '') => {
    buffer += content;
    sendBit();
    if (interval === null) {
      interval = setInterval(sendBit, 10 * 1000);
    }
  };

  res.end = (content = '') => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (res.timedOut) return next(timeoutError);
    return originalEnd(buffer + content);
  };

  return next();
};
