const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(__dirname));

app.use(express.static(
  path.join(__dirname, '..', '..', 'node_modules', 'wgsa_front-end', 'public')
));

app.listen(8001);

console.log('Holding page server listening on 8001.')
