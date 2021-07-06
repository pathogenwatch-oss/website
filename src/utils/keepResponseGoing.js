// This function wraps an express response object and
// returns a new "end" method.  For up to 5 minutes, it
// will periodically send messages to the load balancer
// which will keep the response alive.

// Other methods (send, write, status, end) should not
// be called.

module.exports = function (res) {
  const timedOut = false;
  let interval = setInterval(() => {
    res.writeContinue();
  }, 10 * 1000);
  let timeout = setTimeout(() => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    res.status(504).end('Timeout');
  }, 5 * 60 * 1000);
  return (...args) => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (timedOut) throw new Error('timed out');
    res.end(...args);
  };
};
