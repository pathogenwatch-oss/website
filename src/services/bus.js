const seneca = require('seneca')({
  strict: {
    result: false,
  },
});

exports.DEFAULT_TIMEOUT = seneca.options().timeout;

exports.request = function (role, cmd, message) {
  return new Promise((resolve, reject) => {
    seneca.act({ role, cmd, ...message }, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};

exports.register = function (role, cmd, action) {
  seneca.add({ role, cmd }, (msg, reply) => {
    const promise = action(msg);
    return (promise instanceof Promise ? promise : Promise.resolve(promise))
      .then((result) => reply(null, result))
      .catch(reply);
  });
};
