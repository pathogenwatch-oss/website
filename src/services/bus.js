const seneca = require('seneca')();

exports.request = function (role, cmd, message) {
  return new Promise((resolve, reject) => {
    seneca.act(Object.assign({ role, cmd }, message), (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
};

exports.register = function (role, cmd, action) {
  seneca.add({ role, cmd }, (msg, reply) =>
    action(msg).
      then(result => reply(null, result)).
      catch(reply)
  );
};
