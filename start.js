//var ensureEarssData = require('./earss');

require('./server')(function (error, app) {
  if (error) {
    console.log('Application not started:');
    throw error;
  }
  // ensureEarssData(function (earssError) {
  //   if (earssError) {
  //     // throwing error here to halt application, EARSS data is required.
  //     throw earssError;
  //   }
  //   console.log(
  //     'App available at http://' + app.get('hostname') + ':' + app.get('port')
  //   );
  // });
  console.log(
    'App available at http://' + app.get('hostname') + ':' + app.get('port')
  );
});
