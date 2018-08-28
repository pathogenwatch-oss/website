const http = require('http');

const config = require('./src/configuration');

const options = {
  host: 'localhost',
  port: config.node.port || '8001',
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  console.log('ERROR');
  process.exit(1);
});

request.end();
