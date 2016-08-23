module.exports = function () {
  const mainStorage = require('services/storage')('main');
  console.log("retrieving");
  mainStorage.retrieve('CTR_1280', (err, res) => {
    console.log(res);
  });

  mainStorage.store('HELLO', { recipient: 'WORLD' }, (...args) => {
    console.log(args);
  });
};
